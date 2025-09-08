/*
  # Create predefined kits table for IT Asset Management

  1. New Tables
    - `predefined_kits`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `assets` (text array)
      - `accessories` (text array)
      - `licenses` (text array)
      - `consumables` (text array)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `predefined_kits` table
    - Add policies for authenticated users to manage kits
*/

CREATE TABLE IF NOT EXISTS predefined_kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  description text DEFAULT '',
  category text DEFAULT '',
  assets text[] DEFAULT '{}',
  accessories text[] DEFAULT '{}',
  licenses text[] DEFAULT '{}',
  consumables text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE predefined_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all predefined kits"
  ON predefined_kits
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage predefined kits"
  ON predefined_kits
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_predefined_kits_updated_at 
  BEFORE UPDATE ON predefined_kits 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();