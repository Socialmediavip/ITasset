/*
  # Create licenses table for IT Asset Management

  1. New Tables
    - `licenses`
      - `id` (uuid, primary key)
      - `name` (text)
      - `product_key` (text)
      - `seats` (integer)
      - `available_seats` (integer)
      - `manufacturer` (text)
      - `expiry_date` (date)
      - `category` (text)
      - `cost` (decimal)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `licenses` table
    - Add policies for authenticated users to manage licenses
*/

CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  product_key text DEFAULT '',
  seats integer DEFAULT 1,
  available_seats integer DEFAULT 1,
  manufacturer text DEFAULT '',
  expiry_date date,
  category text DEFAULT '',
  cost decimal(12,2) DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all licenses"
  ON licenses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage licenses"
  ON licenses
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_licenses_updated_at 
  BEFORE UPDATE ON licenses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();