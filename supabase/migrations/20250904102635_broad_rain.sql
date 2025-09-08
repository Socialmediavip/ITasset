/*
  # Create alerts table for IT Asset Management

  1. New Tables
    - `alerts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `message` (text)
      - `type` (text)
      - `status` (text)
      - `priority` (text)
      - `category` (text)
      - `asset_id` (uuid, foreign key to assets)
      - `asset_name` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `acknowledged_at` (timestamptz)
      - `resolved_at` (timestamptz)

  2. Security
    - Enable RLS on `alerts` table
    - Add policies for authenticated users to manage alerts
*/

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  message text DEFAULT '',
  type text DEFAULT 'info',
  status text DEFAULT 'active',
  priority text DEFAULT 'medium',
  category text DEFAULT '',
  asset_id uuid REFERENCES assets(id),
  asset_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_alerts_updated_at 
  BEFORE UPDATE ON alerts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();