/*
  # Fix Resource Policy Conflicts

  1. Changes
    - Drop and recreate conflicting policies safely
    - Ensure all necessary helper functions exist
    - Add missing indexes for performance
    - Verify table structure is complete

  2. Security
    - Maintain existing access control logic
    - Ensure RLS policies work correctly
    - Grant proper permissions to authenticated users
*/

-- First, let's safely drop existing policies that might conflict
DO $$
BEGIN
  -- Drop existing resource policies if they exist
  DROP POLICY IF EXISTS "Public resources are viewable by everyone" ON public.resources;
  DROP POLICY IF EXISTS "Auth-required resources viewable by authenticated users" ON public.resources;
  DROP POLICY IF EXISTS "Paid resources viewable by users with access" ON public.resources;
  DROP POLICY IF EXISTS "Admins can manage all resources" ON public.resources;
END $$;

-- Recreate the resource policies with the correct logic
CREATE POLICY "Public resources are viewable by everyone"
ON public.resources
FOR SELECT
USING (is_public = true);

CREATE POLICY "Auth-required resources viewable by authenticated users"
ON public.resources
FOR SELECT
USING (
  requires_auth = true 
  AND is_paid = false 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Paid resources viewable by users with access"
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
);

CREATE POLICY "Admins can manage all resources"
ON public.resources
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

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

-- Recreate helper functions to ensure they exist and are up to date
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

-- Recreate the get_user_accessible_resources function
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