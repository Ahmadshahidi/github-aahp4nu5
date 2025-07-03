/*
  # Create avatars storage bucket

  1. Storage Setup
    - Create 'avatars' storage bucket
    - Set bucket as public for avatar display
    - Configure file size limits and allowed MIME types

  2. Security Policies
    - Public read access for all avatars
    - Authenticated users can upload to their own folder
    - Users can update/delete their own avatars
    - File type restrictions for security
*/

-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

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