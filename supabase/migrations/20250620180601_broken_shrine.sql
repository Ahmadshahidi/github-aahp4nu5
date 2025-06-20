/*
  # Enhanced Profile Image Storage Policies

  1. Storage Policies
    - Users can upload their own profile images
    - Users can view their own profile images
    - Users can update/replace their own profile images
    - Users can delete their own profile images
    - Public read access for all profile images (for display purposes)

  2. Security
    - Authenticated users only for upload/update/delete
    - Path-based security using user ID in folder structure
    - File type restrictions for images only
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create comprehensive storage policies for profile images
CREATE POLICY "Public read access for profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload their own profile image"
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

CREATE POLICY "Users can view their own profile images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars'
  AND (
    -- Public access for viewing
    true
    OR
    -- Owner access
    (auth.uid()::text = (storage.foldername(name))[1])
  )
);

CREATE POLICY "Users can update their own profile image"
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

CREATE POLICY "Users can delete their own profile image"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Ensure the avatars bucket exists and is properly configured
DO $$
BEGIN
  -- Create bucket if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'avatars',
      'avatars',
      true,
      5242880, -- 5MB limit
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    );
  ELSE
    -- Update existing bucket with proper configuration
    UPDATE storage.buckets
    SET 
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    WHERE id = 'avatars';
  END IF;
END $$;