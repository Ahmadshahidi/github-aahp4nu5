/*
  # Delete file count trigger

  1. Changes
    - Drop the trigger "update_resource_file_count_on_insert" that already exists
    - This resolves the conflict error when trying to create it again
*/

-- Drop the existing trigger that's causing the conflict
DROP TRIGGER IF EXISTS update_resource_file_count_on_insert ON storage.objects;

-- Also drop the delete trigger if it exists
DROP TRIGGER IF EXISTS update_resource_file_count_on_delete ON storage.objects;

-- Drop the function if it exists to clean up
DROP FUNCTION IF EXISTS public.update_resource_file_count();