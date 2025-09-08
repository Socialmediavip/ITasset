/*
  # Create components table for IT Asset Management

  1. New Tables
    - `components`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `manufacturer` (text)
      - `model` (text)
      - `serial_number` (text)
      - `quantity` (integer)
      - `location` (text)
      - `purchase_date` (date)
      - `purchase_cost` (decimal)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `components` table
    - Add policies for authenticated users to manage components
*/

CREATE TABLE IF NOT EXISTS components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text DEFAULT '',
  manufacturer text DEFAULT '',
  model text DEFAULT '',
  serial_number text DEFAULT '',
  quantity integer DEFAULT 1,
  location text DEFAULT '',
  purchase_date date,
  purchase_cost decimal(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all components"
  ON components
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage components"
  ON components
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_components_updated_at 
  BEFORE UPDATE ON components 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();