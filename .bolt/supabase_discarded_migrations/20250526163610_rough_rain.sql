/*
  # Add profile fields and storage setup

  1. Changes
    - Add new profile fields to profiles table
    - Create storage bucket for avatars
    - Add policies for avatar access

  2. Security
    - Enable RLS for storage
    - Add policies for avatar upload/view
*/

-- Add new profile fields
ALTER TABLE public.profiles
ADD COLUMN full_name text,
ADD COLUMN avatar_url text,
ADD COLUMN highest_education text,
ADD COLUMN company text,
ADD COLUMN experience_years integer,
ADD COLUMN job_title text,
ADD COLUMN is_public boolean DEFAULT false;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);