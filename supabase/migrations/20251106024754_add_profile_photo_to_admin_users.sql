/*
  # Add Profile Photo to Admin Users

  1. Schema Changes
    - Add `profile_photo_url` column to `admin_users` table
      - Stores the URL of the profile photo from Supabase Storage
      - Optional field (nullable)
      - Default value: null
  
  2. Security
    - Update existing policy to allow admins to update their own profile
    - Add policy for admins to update their profile photo

  3. Storage
    - Profile photos will be stored in Supabase Storage bucket 'avatars'
*/

-- Add profile_photo_url column to admin_users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'profile_photo_url'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN profile_photo_url text;
  END IF;
END $$;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can update own profile" ON admin_users;

-- Create policy for admins to update their own profile
CREATE POLICY "Admins can update own profile"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);