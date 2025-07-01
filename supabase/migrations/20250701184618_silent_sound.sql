/*
  # Resource Access Control System

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `url` (text, required - link to resource content)
      - `is_public` (boolean, default false - accessible to all users)
      - `requires_auth` (boolean, default false - requires authentication)
      - `is_paid` (boolean, default false - requires purchase)
      - `price` (numeric, optional - individual purchase price)
      - `category` (text, optional - for organization)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

    - `user_resource_access`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users.id)
      - `resource_id` (uuid, references resources.id)
      - `purchased_at` (timestamptz, default now)
      - `expires_at` (timestamptz, optional - for time-limited access)
      - Unique constraint on (user_id, resource_id)

    - `global_access_purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users.id)
      - `purchased_at` (timestamptz, default now)
      - `valid_until` (timestamptz, optional - expiry date for global access)
      - `is_active` (boolean, default true)

  2. Security
    - Enable RLS on all tables
    - Public resources accessible to everyone
    - Auth-required resources accessible to authenticated users
    - Paid resources accessible only with purchase or global access
    - Users can only see their own access records
*/

-- Add file_count column to resources if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resources' AND column_name = 'file_count'
  ) THEN
    ALTER TABLE public.resources ADD COLUMN file_count integer DEFAULT 0;
  END IF;
END $$;

-- Add primary_file_path column to resources if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resources' AND column_name = 'primary_file_path'
  ) THEN
    ALTER TABLE public.resources ADD COLUMN primary_file_path text;
  END IF;
END $$;

-- Add file_type column to resources if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resources' AND column_name = 'file_type'
  ) THEN
    ALTER TABLE public.resources ADD COLUMN file_type text;
  END IF;
END $$;

-- Create resources table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  is_public boolean DEFAULT false,
  requires_auth boolean DEFAULT false,
  is_paid boolean DEFAULT false,
  price numeric(10,2),
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  file_count integer DEFAULT 0,
  primary_file_path text,
  file_type text,
  
  -- Constraints
  CONSTRAINT valid_access_logic CHECK (
    -- If public, cannot require auth or payment
    (is_public = true AND requires_auth = false AND is_paid = false) OR
    -- If not public, must require auth or payment (or both)
    (is_public = false AND (requires_auth = true OR is_paid = true))
  ),
  CONSTRAINT valid_price CHECK (
    (is_paid = false AND price IS NULL) OR
    (is_paid = true AND price > 0)
  )
);

-- Create user_resource_access table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_resource_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  
  -- Unique constraint to prevent duplicate purchases
  UNIQUE(user_id, resource_id)
);

-- Create global_access_purchases table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.global_access_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  
  -- Only one active global access per user
  UNIQUE(user_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS resources_category_idx ON public.resources(category);
CREATE INDEX IF NOT EXISTS resources_access_type_idx ON public.resources(is_public, requires_auth, is_paid);
CREATE INDEX IF NOT EXISTS user_resource_access_user_id_idx ON public.user_resource_access(user_id);
CREATE INDEX IF NOT EXISTS user_resource_access_resource_id_idx ON public.user_resource_access(resource_id);
CREATE INDEX IF NOT EXISTS global_access_purchases_user_id_idx ON public.global_access_purchases(user_id);
CREATE INDEX IF NOT EXISTS global_access_purchases_active_idx ON public.global_access_purchases(user_id, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_resource_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_access_purchases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public resources are viewable by everyone" ON public.resources;
DROP POLICY IF EXISTS "Auth-required resources viewable by authenticated users" ON public.resources;
DROP POLICY IF EXISTS "Paid resources viewable by users with access" ON public.resources;
DROP POLICY IF EXISTS "Admins can manage all resources" ON public.resources;
DROP POLICY IF EXISTS "Users can view their own resource access" ON public.user_resource_access;
DROP POLICY IF EXISTS "Users can purchase resource access" ON public.user_resource_access;
DROP POLICY IF EXISTS "Users can update their own resource access" ON public.user_resource_access;
DROP POLICY IF EXISTS "Users can view their own global access" ON public.global_access_purchases;
DROP POLICY IF EXISTS "Users can purchase global access" ON public.global_access_purchases;
DROP POLICY IF EXISTS "Users can update their own global access" ON public.global_access_purchases;

-- Resources policies
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

-- User resource access policies
CREATE POLICY "Users can view their own resource access"
ON public.user_resource_access
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase resource access"
ON public.user_resource_access
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resource access"
ON public.user_resource_access
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Global access policies
CREATE POLICY "Users can view their own global access"
ON public.global_access_purchases
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase global access"
ON public.global_access_purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own global access"
ON public.global_access_purchases
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Helper function: Check if user has access to a specific resource
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

-- Helper function: Get all resources accessible to the current user
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

-- Function to update resource updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_resource_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at if it doesn't exist
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resource_updated_at();

-- Insert sample data for testing
INSERT INTO public.resources (title, description, url, is_public, requires_auth, is_paid, price, category) VALUES
-- Public resources
('Introduction to Statistics', 'Basic statistical concepts for everyone', '/resources/intro-stats', true, false, false, NULL, 'education'),
('Data Visualization Basics', 'Learn the fundamentals of data visualization', '/resources/dataviz-basics', true, false, false, NULL, 'education'),

-- Auth-required resources
('Intermediate Statistics', 'Advanced statistical methods for authenticated users', '/resources/intermediate-stats', false, true, false, NULL, 'education'),
('Python for Data Science', 'Programming tutorials for data analysis', '/resources/python-datascience', false, true, false, NULL, 'programming'),

-- Paid resources
('Advanced Machine Learning', 'Comprehensive ML course with hands-on projects', '/resources/advanced-ml', false, false, true, 299.99, 'premium'),
('Statistical Consulting Session', 'One-on-one consultation with expert statisticians', '/resources/consulting', false, false, true, 150.00, 'consulting'),
('Deep Learning Masterclass', 'Complete deep learning curriculum', '/resources/deep-learning', false, false, true, 499.99, 'premium'),
('Time Series Analysis Workshop', 'Specialized workshop on time series forecasting', '/resources/timeseries-workshop', false, false, true, 199.99, 'workshop')
ON CONFLICT (title) DO NOTHING;