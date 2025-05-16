/*
  # Create admin user

  1. Changes
    - Updates the profiles table to set admin privileges for a specific user
    - Ensures idempotency by using DO block with conditional check
*/

DO $$ 
BEGIN 
  -- Set admin privileges for the user
  UPDATE profiles 
  SET is_admin = true 
  WHERE username = 'admin';

  -- If admin user doesn't exist, create it
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
    -- Insert into auth.users using Supabase's auth.create_user function
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
  END IF;
END $$;