/*
  # Create avatars storage bucket

  1. Storage Setup
    - Create 'avatars' bucket for profile images
    - Set bucket as public for easy access
    - Configure file size limit (5MB)
    - Set allowed MIME types for images

  2. Security Policies
    - Public read access for all avatars
    - Authenticated users can upload to their own folder
    - Users can update/delete their own avatars only
    - File type validation in policies
*/

-- Create the avatars bucket if it doesn't exist
DO $$
BEGIN
  -- Check if bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'avatars',
      'avatars', 
      true,
      5242880, -- 5MB limit
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    );
  ELSE
    -- Update existing bucket configuration
    UPDATE storage.buckets
    SET 
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    WHERE id = 'avatars';
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Create storage policies for avatars
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (
    lower((storage.filename(name))) LIKE '%.jpg' OR
    lower((storage.filename(name))) LIKE '%.jpeg' OR
    lower((storage.filename(name))) LIKE '%.png' OR
    lower((storage.filename(name))) LIKE '%.gif' OR
    lower((storage.filename(name))) LIKE '%.webp'
  )
);

CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (
    lower((storage.filename(name))) LIKE '%.jpg' OR
    lower((storage.filename(name))) LIKE '%.jpeg' OR
    lower((storage.filename(name))) LIKE '%.png' OR
    lower((storage.filename(name))) LIKE '%.gif' OR
    lower((storage.filename(name))) LIKE '%.webp'
  )
);

CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);