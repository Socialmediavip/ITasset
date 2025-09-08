/*
  # Create consumables table for IT Asset Management

  1. New Tables
    - `consumables`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `manufacturer` (text)
      - `model` (text)
      - `quantity` (integer)
      - `min_quantity` (integer)
      - `location` (text)
      - `item_number` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `consumables` table
    - Add policies for authenticated users to manage consumables
*/

CREATE TABLE IF NOT EXISTS consumables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text DEFAULT '',
  manufacturer text DEFAULT '',
  model text DEFAULT '',
  quantity integer DEFAULT 0,
  min_quantity integer DEFAULT 5,
  location text DEFAULT '',
  item_number text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consumables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all consumables"
  ON consumables
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage consumables"
  ON consumables
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_consumables_updated_at 
  BEFORE UPDATE ON consumables 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();