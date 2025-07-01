/*
  # Fix profile columns migration

  1. Changes
    - Add profile columns only if they don't already exist
    - Use proper conditional checks to avoid duplicate column errors
    - Ensure all profile-related columns are present with proper defaults

  2. Security
    - No changes to existing RLS policies
    - Column additions are safe operations
*/

-- Add profile columns only if they don't exist
DO $$
BEGIN
  -- Add avatar_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url text DEFAULT '';
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
    ALTER TABLE public.profiles ADD COLUMN highest_education text DEFAULT 'NULL';
  END IF;

  -- Add company column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'company'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN company text DEFAULT 'NULL';
  END IF;

  -- Add experience_years column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'experience_years'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN experience_years smallint DEFAULT 0;
  END IF;

  -- Add position column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'position'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN position text DEFAULT 'NULL';
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
    ALTER TABLE public.profiles ADD COLUMN is_public boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Add constraints only if they don't exist
DO $$
BEGIN
  -- Add check constraint for experience_years if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_YOE_check'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_YOE_check CHECK (experience_years >= 0);
  END IF;

  -- Add check constraint for company length if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_company_check'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_company_check CHECK (length(company) < 20);
  END IF;

  -- Add check constraint for education length if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_education_check'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_education_check CHECK (length(highest_education) < 10);
  END IF;

  -- Add check constraint for position length if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_position_check'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_position_check CHECK (length("position") < 20);
  END IF;
END $$;