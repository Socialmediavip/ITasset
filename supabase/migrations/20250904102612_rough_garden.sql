/*
  # Create accessories table for IT Asset Management

  1. New Tables
    - `accessories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `manufacturer` (text)
      - `model` (text)
      - `quantity` (integer)
      - `available_quantity` (integer)
      - `location` (text)
      - `purchase_date` (date)
      - `purchase_cost` (decimal)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `accessories` table
    - Add policies for authenticated users to manage accessories
*/

CREATE TABLE IF NOT EXISTS accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text DEFAULT '',
  manufacturer text DEFAULT '',
  model text DEFAULT '',
  quantity integer DEFAULT 1,
  available_quantity integer DEFAULT 1,
  location text DEFAULT '',
  purchase_date date,
  purchase_cost decimal(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all accessories"
  ON accessories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage accessories"
  ON accessories
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_accessories_updated_at 
  BEFORE UPDATE ON accessories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();