/*
  # Fix existing resource policy conflicts

  1. Changes
    - Check if policies exist before creating them
    - Only create missing policies
    - Ensure all necessary columns and functions exist
    - Add proper indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control for resources
*/

-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(table_name text, policy_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = table_name 
    AND policyname = policy_name
  );
END;
$$ LANGUAGE plpgsql;

-- Only create policies if they don't exist
DO $$
BEGIN
  -- Create "Public resources are viewable by everyone" policy if it doesn't exist
  IF NOT policy_exists('resources', 'Public resources are viewable by everyone') THEN
    EXECUTE 'CREATE POLICY "Public resources are viewable by everyone"
    ON public.resources
    FOR SELECT
    USING (is_public = true)';
  END IF;

  -- Create "Auth-required resources viewable by authenticated users" policy if it doesn't exist
  IF NOT policy_exists('resources', 'Auth-required resources viewable by authenticated users') THEN
    EXECUTE 'CREATE POLICY "Auth-required resources viewable by authenticated users"
    ON public.resources
    FOR SELECT
    USING (
      requires_auth = true 
      AND is_paid = false 
      AND auth.role() = ''authenticated''
    )';
  END IF;

  -- Create "Paid resources viewable by users with access" policy if it doesn't exist
  IF NOT policy_exists('resources', 'Paid resources viewable by users with access') THEN
    EXECUTE 'CREATE POLICY "Paid resources viewable by users with access"
    ON public.resources
    FOR SELECT
    USING (
      is_paid = true 
      AND (
        -- User has purchased this specific resource
        EXISTS (
          SELECT 1 FROM public.user_resource_access ura
          WHERE ura.resource_id = resources.id
          AND ura.user_id = auth.uid()
          AND (ura.expires_at IS NULL OR ura.expires_at > now())
        )
        OR
        -- User has active global access
        EXISTS (
          SELECT 1 FROM public.global_access_purchases gap
          WHERE gap.user_id = auth.uid()
          AND gap.is_active = true
          AND (gap.valid_until IS NULL OR gap.valid_until > now())
        )
      )
    )';
  END IF;

  -- Create "Admins can manage all resources" policy if it doesn't exist
  IF NOT policy_exists('resources', 'Admins can manage all resources') THEN
    EXECUTE 'CREATE POLICY "Admins can manage all resources"
    ON public.resources
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    )';
  END IF;
END $$;

-- Ensure all necessary indexes exist for better performance
CREATE INDEX IF NOT EXISTS idx_resources_is_public ON public.resources(is_public);
CREATE INDEX IF NOT EXISTS idx_resources_requires_auth ON public.resources(requires_auth);
CREATE INDEX IF NOT EXISTS idx_resources_is_paid ON public.resources(is_paid);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_access_type ON public.resources(is_public, requires_auth, is_paid);

-- Ensure the resources table has all necessary columns
DO $$
BEGIN
  -- Add file_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resources' AND column_name = 'file_count'
  ) THEN
    ALTER TABLE public.resources ADD COLUMN file_count integer DEFAULT 0;
  END IF;

  -- Add primary_file_path column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resources' AND column_name = 'primary_file_path'
  ) THEN
    ALTER TABLE public.resources ADD COLUMN primary_file_path text;
  END IF;

  -- Add file_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resources' AND column_name = 'file_type'
  ) THEN
    ALTER TABLE public.resources ADD COLUMN file_type text;
  END IF;
END $$;

-- Ensure helper functions exist and are up to date
CREATE OR REPLACE FUNCTION public.user_has_resource_access(resource_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  resource_record public.resources%ROWTYPE;
BEGIN
  -- Get resource details
  SELECT * INTO resource_record
  FROM public.resources
  WHERE id = resource_uuid;
  
  -- Resource doesn't exist
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Public resources are always accessible
  IF resource_record.is_public THEN
    RETURN true;
  END IF;
  
  -- Check if user is authenticated for auth-required resources
  IF resource_record.requires_auth AND NOT resource_record.is_paid THEN
    RETURN auth.role() = 'authenticated';
  END IF;
  
  -- Check paid resource access
  IF resource_record.is_paid THEN
    -- Must be authenticated
    IF auth.role() != 'authenticated' THEN
      RETURN false;
    END IF;
    
    -- Check global access
    IF EXISTS (
      SELECT 1 FROM public.global_access_purchases
      WHERE user_id = auth.uid()
      AND is_active = true
      AND (valid_until IS NULL OR valid_until > now())
    ) THEN
      RETURN true;
    END IF;
    
    -- Check individual resource access
    RETURN EXISTS (
      SELECT 1 FROM public.user_resource_access
      WHERE user_id = auth.uid()
      AND resource_id = resource_uuid
      AND (expires_at IS NULL OR expires_at > now())
    );
  END IF;
  
  RETURN false;
END;
$$;

-- Ensure the get_user_accessible_resources function exists
CREATE OR REPLACE FUNCTION public.get_user_accessible_resources()
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  url text,
  category text,
  access_type text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.description,
    r.url,
    r.category,
    CASE 
      WHEN r.is_public THEN 'public'
      WHEN r.requires_auth AND NOT r.is_paid THEN 'authenticated'
      WHEN r.is_paid THEN 'paid'
      ELSE 'unknown'
    END as access_type,
    r.created_at
  FROM public.resources r
  WHERE public.user_has_resource_access(r.id)
  ORDER BY r.created_at DESC;
END;
$$;

-- Grant necessary permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.user_has_resource_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_accessible_resources() TO authenticated;

-- Ensure RLS is enabled on the resources table
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Clean up the helper function
DROP FUNCTION IF EXISTS policy_exists(text, text);