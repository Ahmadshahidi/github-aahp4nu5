/*
  # Add email field to profiles

  1. Changes
    - Add email column to profiles table
    - Update trigger to store actual email
    - Add email uniqueness constraint
*/

ALTER TABLE public.profiles
ADD COLUMN email text UNIQUE;

-- Update the trigger function to store the actual email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (new.id, SPLIT_PART(new.email, '@', 1), new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;