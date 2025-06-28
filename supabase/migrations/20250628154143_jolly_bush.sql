/*
  # Add public resources access policy

  1. Changes
    - Add policy to allow everyone to access public resources
    - Ensure public resources are viewable by all users regardless of authentication status

  2. Security
    - Only applies to resources where is_public = true
    - No authentication required for public resources
*/

-- Add policy for public resources to be accessible by everyone
CREATE POLICY "Public resources can be accessed by everyone"
ON public.resources
FOR SELECT
USING (is_public = true);