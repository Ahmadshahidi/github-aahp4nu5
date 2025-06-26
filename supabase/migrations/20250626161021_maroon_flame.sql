/*
  # Supabase Storage Setup for Resource Files

  1. Storage Buckets
    - `public-resources`: Files accessible to everyone
    - `protected-resources`: Files requiring authentication and access validation

  2. Security Policies
    - Public bucket: Read access for all, admin-only write
    - Protected bucket: Access controlled via RLS and signed URLs
    - Integration with existing resource access control system

  3. File Organization
    - Files organized by resource ID: bucket/resource_id/filename
    - Supports multiple file types: PDFs, videos, images, documents
*/

-- Create public-resources bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-resources',
  'public-resources',
  true, -- Public read access
  104857600, -- 100MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'text/plain',
    'text/csv',
    'application/json',
    'application/zip',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create protected-resources bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'protected-resources',
  'protected-resources',
  false, -- Private bucket, access via signed URLs
  524288000, -- 500MB limit for premium content
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'text/plain',
    'text/csv',
    'application/json',
    'application/zip',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for public resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for public resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for public resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for public resources" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view accessible protected resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for protected resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for protected resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for protected resources" ON storage.objects;

-- PUBLIC RESOURCES BUCKET POLICIES

-- Public read access for public-resources bucket
CREATE POLICY "Public read access for public resources"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'public-resources'
);

-- Admin-only upload for public-resources
CREATE POLICY "Admin upload access for public resources"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-resources'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
  AND (storage.foldername(name))[1] IS NOT NULL -- Must be organized in folders
);

-- Admin-only update for public-resources
CREATE POLICY "Admin update access for public resources"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'public-resources'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  bucket_id = 'public-resources'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admin-only delete for public-resources
CREATE POLICY "Admin delete access for public resources"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public-resources'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- PROTECTED RESOURCES BUCKET POLICIES

-- Access control for protected-resources based on resource access
CREATE POLICY "Authenticated users can view accessible protected resources"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'protected-resources'
  AND auth.role() = 'authenticated'
  AND (
    -- Admin can access everything
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
    OR
    -- User has access to the specific resource
    EXISTS (
      SELECT 1 FROM public.resources r
      WHERE r.id::text = (storage.foldername(name))[1]
      AND public.user_has_resource_access(r.id)
    )
  )
);

-- Admin-only upload for protected-resources
CREATE POLICY "Admin upload access for protected resources"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'protected-resources'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
  AND (storage.foldername(name))[1] IS NOT NULL -- Must be organized by resource ID
  AND EXISTS (
    SELECT 1 FROM public.resources
    WHERE id::text = (storage.foldername(name))[1]
  ) -- Resource must exist
);

-- Admin-only update for protected-resources
CREATE POLICY "Admin update access for protected resources"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'protected-resources'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  bucket_id = 'protected-resources'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admin-only delete for protected-resources
CREATE POLICY "Admin delete access for protected resources"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'protected-resources'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Helper function: Get signed URL for protected resource
CREATE OR REPLACE FUNCTION public.get_protected_resource_url(
  resource_uuid uuid,
  file_path text,
  expires_in integer DEFAULT 3600
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  full_path text;
  signed_url text;
BEGIN
  -- Check if user has access to the resource
  IF NOT public.user_has_resource_access(resource_uuid) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Access denied to this resource'
    );
  END IF;
  
  -- Construct full file path
  full_path := resource_uuid::text || '/' || file_path;
  
  -- Note: In a real implementation, you would call Supabase's storage API
  -- to generate a signed URL. This is a placeholder for the concept.
  signed_url := 'https://your-project.supabase.co/storage/v1/object/sign/protected-resources/' || full_path;
  
  RETURN json_build_object(
    'success', true,
    'signed_url', signed_url,
    'expires_in', expires_in
  );
END;
$$;

-- Helper function: List accessible files for a resource
CREATE OR REPLACE FUNCTION public.get_resource_files(resource_uuid uuid)
RETURNS TABLE (
  file_name text,
  file_path text,
  bucket_name text,
  file_size bigint,
  content_type text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  resource_record public.resources%ROWTYPE;
  target_bucket text;
BEGIN
  -- Get resource details
  SELECT * INTO resource_record
  FROM public.resources
  WHERE id = resource_uuid;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Check access
  IF NOT public.user_has_resource_access(resource_uuid) THEN
    RETURN;
  END IF;
  
  -- Determine bucket based on resource type
  IF resource_record.is_public THEN
    target_bucket := 'public-resources';
  ELSE
    target_bucket := 'protected-resources';
  END IF;
  
  -- Return files for this resource
  RETURN QUERY
  SELECT 
    (storage.filename(objects.name))::text as file_name,
    objects.name::text as file_path,
    objects.bucket_id::text as bucket_name,
    objects.metadata->>'size' as file_size,
    objects.metadata->>'mimetype' as content_type,
    objects.created_at
  FROM storage.objects
  WHERE bucket_id = target_bucket
  AND (storage.foldername(name))[1] = resource_uuid::text
  ORDER BY created_at DESC;
END;
$$;

-- Helper function: Check if file exists for resource
CREATE OR REPLACE FUNCTION public.resource_file_exists(
  resource_uuid uuid,
  file_path text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  resource_record public.resources%ROWTYPE;
  target_bucket text;
  full_path text;
BEGIN
  -- Get resource details
  SELECT * INTO resource_record
  FROM public.resources
  WHERE id = resource_uuid;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Determine bucket
  IF resource_record.is_public THEN
    target_bucket := 'public-resources';
  ELSE
    target_bucket := 'protected-resources';
  END IF;
  
  -- Construct full path
  full_path := resource_uuid::text || '/' || file_path;
  
  -- Check if file exists
  RETURN EXISTS (
    SELECT 1 FROM storage.objects
    WHERE bucket_id = target_bucket
    AND name = full_path
  );
END;
$$;

-- Update resources table to include file information
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS file_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS primary_file_path text,
ADD COLUMN IF NOT EXISTS file_type text;

-- Function to update file count for resources
CREATE OR REPLACE FUNCTION public.update_resource_file_count()
RETURNS trigger AS $$
DECLARE
  resource_uuid uuid;
  target_bucket text;
  new_count integer;
BEGIN
  -- Extract resource UUID from file path
  resource_uuid := (storage.foldername(COALESCE(NEW.name, OLD.name)))[1]::uuid;
  
  -- Determine bucket
  target_bucket := COALESCE(NEW.bucket_id, OLD.bucket_id);
  
  -- Skip if not a resource bucket
  IF target_bucket NOT IN ('public-resources', 'protected-resources') THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Count files for this resource
  SELECT COUNT(*)::integer INTO new_count
  FROM storage.objects
  WHERE bucket_id = target_bucket
  AND (storage.foldername(name))[1] = resource_uuid::text;
  
  -- Update resource file count
  UPDATE public.resources
  SET file_count = new_count
  WHERE id = resource_uuid;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for file count updates
CREATE TRIGGER update_resource_file_count_on_insert
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resource_file_count();

CREATE TRIGGER update_resource_file_count_on_delete
  AFTER DELETE ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resource_file_count();

-- Sample file organization (comments for reference)
/*
File Organization Structure:

public-resources/
├── resource-uuid-1/
│   ├── intro-video.mp4
│   ├── slides.pdf
│   └── worksheet.pdf
└── resource-uuid-2/
    ├── tutorial.pdf
    └── dataset.csv

protected-resources/
├── resource-uuid-3/
│   ├── advanced-course.mp4
│   ├── materials.zip
│   └── certificate-template.pdf
└── resource-uuid-4/
    ├── consultation-notes.pdf
    └── analysis-report.pdf

Usage Examples:

-- Get all files for a resource
SELECT * FROM public.get_resource_files('resource-uuid-here');

-- Check if specific file exists
SELECT public.resource_file_exists('resource-uuid-here', 'intro-video.mp4');

-- Get signed URL for protected file
SELECT public.get_protected_resource_url('resource-uuid-here', 'advanced-course.mp4', 7200);

-- Check user access to resource
SELECT public.user_has_resource_access('resource-uuid-here');
*/