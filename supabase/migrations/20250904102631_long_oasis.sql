/*
  # Create requestable items table for IT Asset Management

  1. New Tables
    - `requestable_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `description` (text)
      - `image` (text)
      - `requestable` (boolean, default true)
      - `quantity` (integer)
      - `location` (text)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `requestable_items` table
    - Add policies for authenticated users to manage requestable items
*/

CREATE TABLE IF NOT EXISTS requestable_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text DEFAULT '',
  description text DEFAULT '',
  image text DEFAULT '',
  requestable boolean DEFAULT true,
  quantity integer DEFAULT 1,
  location text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE requestable_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all requestable items"
  ON requestable_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage requestable items"
  ON requestable_items
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_requestable_items_updated_at 
  BEFORE UPDATE ON requestable_items 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();