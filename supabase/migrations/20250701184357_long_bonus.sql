/*
  # Fix existing columns migration

  1. Changes
    - Only add columns that don't already exist
    - Use proper conditional checks for all profile columns
    - Handle existing constraints gracefully

  2. Security
    - No changes to existing RLS policies
    - Safe column additions only
*/

-- Function to safely add column if it doesn't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_definition text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = add_column_if_not_exists.table_name 
    AND column_name = add_column_if_not_exists.column_name
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s', table_name, column_name, column_definition);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to safely add constraint if it doesn't exist
CREATE OR REPLACE FUNCTION add_constraint_if_not_exists(
  table_name text,
  constraint_name text,
  constraint_definition text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_schema = 'public'
    AND table_name = add_constraint_if_not_exists.table_name 
    AND constraint_name = add_constraint_if_not_exists.constraint_name
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I %s', table_name, constraint_name, constraint_definition);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add profile columns only if they don't exist
SELECT add_column_if_not_exists('profiles', 'avatar_url', 'text DEFAULT ''''');
SELECT add_column_if_not_exists('profiles', 'full_name', 'text');
SELECT add_column_if_not_exists('profiles', 'highest_education', 'text DEFAULT ''NULL''');
SELECT add_column_if_not_exists('profiles', 'company', 'text DEFAULT ''NULL''');
SELECT add_column_if_not_exists('profiles', 'experience_years', 'smallint DEFAULT 0');
SELECT add_column_if_not_exists('profiles', 'position', 'text DEFAULT ''NULL''');
SELECT add_column_if_not_exists('profiles', 'job_title', 'text');
SELECT add_column_if_not_exists('profiles', 'is_public', 'boolean DEFAULT false NOT NULL');

-- Add constraints only if they don't exist
SELECT add_constraint_if_not_exists('profiles', 'profiles_YOE_check', 'CHECK (experience_years >= 0)');
SELECT add_constraint_if_not_exists('profiles', 'profiles_company_check', 'CHECK (length(company) < 20)');
SELECT add_constraint_if_not_exists('profiles', 'profiles_education_check', 'CHECK (length(highest_education) < 10)');
SELECT add_constraint_if_not_exists('profiles', 'profiles_position_check', 'CHECK (length("position") < 20)');

-- Clean up helper functions
DROP FUNCTION IF EXISTS add_column_if_not_exists(text, text, text);
DROP FUNCTION IF EXISTS add_constraint_if_not_exists(text, text, text);