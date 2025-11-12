/*
  # Create Social Registrations Table

  1. New Tables
    - `social_registrations`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `cpf` (text, required, unique)
      - `rg` (text, required)
      - `nis_pis` (text, required)
      - `voter_registration` (text)
      - `personal_phone` (text, required)
      - `reference_phone_1` (text, required)
      - `reference_phone_2` (text)
      - `reference_phone_3` (text)
      - `adults_count` (integer, required, minimum 1)
      - `minors_count` (integer, required, minimum 0)
      - `has_disability` (boolean, required)
      - `disability_count` (integer)
      - `address` (text, required)
      - `neighborhood` (text, required)
      - `cep` (text, required)
      - `female_head_of_household` (boolean, required)
      - `has_elderly` (boolean, required)
      - `vulnerable_situation` (boolean, required)
      - `homeless` (boolean, required)
      - `domestic_violence_victim` (boolean, required)
      - `cohabitation` (boolean, required)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `social_registrations` table
    - Add policy allowing public inserts
    - Add policy for selecting own records
*/

CREATE TABLE IF NOT EXISTS social_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cpf text NOT NULL UNIQUE,
  rg text NOT NULL,
  nis_pis text NOT NULL,
  voter_registration text,
  personal_phone text NOT NULL,
  reference_phone_1 text NOT NULL,
  reference_phone_2 text,
  reference_phone_3 text,
  adults_count integer NOT NULL CHECK (adults_count >= 1),
  minors_count integer NOT NULL DEFAULT 0 CHECK (minors_count >= 0),
  has_disability boolean NOT NULL DEFAULT false,
  disability_count integer,
  address text NOT NULL,
  neighborhood text NOT NULL,
  cep text NOT NULL,
  female_head_of_household boolean NOT NULL DEFAULT false,
  has_elderly boolean NOT NULL DEFAULT false,
  vulnerable_situation boolean NOT NULL DEFAULT false,
  homeless boolean NOT NULL DEFAULT false,
  domestic_violence_victim boolean NOT NULL DEFAULT false,
  cohabitation boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert social registrations"
  ON social_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own registrations"
  ON social_registrations
  FOR SELECT
  TO public
  USING (true);
