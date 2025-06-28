/*
  # Delete public resources policy

  1. Changes
    - Drop the "Public resources are viewable by everyone" policy from the resources table
    - This will remove the conflicting policy that was causing the error

  2. Security
    - Other policies will still control access to resources
    - Admin policies and paid resource policies remain intact
*/

-- Drop the specific policy that's causing conflicts
DROP POLICY IF EXISTS "Public resources are viewable by everyone" ON public.resources;

-- Verify the policy is removed by checking if any other policies exist
-- This is just for verification, the actual deletion happens above
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resources' 
    AND policyname = 'Public resources are viewable by everyone'
  ) THEN
    RAISE NOTICE 'Policy still exists after deletion attempt';
  ELSE
    RAISE NOTICE 'Policy successfully deleted';
  END IF;
END $$;