/*
  # Add avatar_url column to profiles table

  1. Changes
    - Add avatar_url column to profiles table if it doesn't exist
    - Ensure all profile-related columns are present
    - Update the profiles table structure to match the Profile model

  2. Security
    - No changes to existing RLS policies
    - Column additions are safe operations
*/

-- Add avatar_url column if it doesn't exist
DO $$
BEGIN
  -- Add avatar_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url text;
  END IF;

  -- Add full_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name text;
  END IF;

  -- Add highest_education column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'highest_education'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN highest_education text;
  END IF;

  -- Add company column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'company'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN company text;
  END IF;

  -- Add experience_years column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'experience_years'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN experience_years integer;
  END IF;

  -- Add job_title column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'job_title'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN job_title text;
  END IF;

  -- Add is_public column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_public boolean DEFAULT false;
  END IF;
END $$;