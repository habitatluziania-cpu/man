/*
  # Create Admin Users Table and Update Policies

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, required)
      - `full_name` (text, required)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security Changes
    - Update social_registrations SELECT policy to only allow authenticated admin users
    - Enable RLS on admin_users table
    - Add policy for admins to read their own profile
    
  3. Important Notes
    - Admin users must be created through Supabase Auth
    - After creating an auth user, add their ID to the admin_users table
    - Only authenticated admins can view social registrations
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read their own profile
CREATE POLICY "Admins can read own profile"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Drop existing public SELECT policy on social_registrations
DROP POLICY IF EXISTS "Users can view their own registrations" ON social_registrations;

-- Create new policy: Only authenticated admins can view all registrations
CREATE POLICY "Admins can view all registrations"
  ON social_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create an index for better performance on admin lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_id ON admin_users(id);
CREATE INDEX IF NOT EXISTS idx_social_registrations_created_at ON social_registrations(created_at DESC);