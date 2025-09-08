/*
  # Create maintenance records table for IT Asset Management

  1. New Tables
    - `maintenance_records`
      - `id` (uuid, primary key)
      - `asset_id` (uuid, foreign key to assets)
      - `date` (timestamptz)
      - `type` (text)
      - `description` (text)
      - `cost` (decimal)
      - `vendor` (text)
      - `technician` (text)
      - `status` (text)
      - `scheduled_date` (timestamptz)
      - `completed_date` (timestamptz)
      - `next_maintenance_date` (timestamptz)
      - `parts_used` (text array)
      - `incident_id` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `maintenance_records` table
    - Add policies for authenticated users to manage maintenance records
*/

CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id),
  date timestamptz DEFAULT now(),
  type text DEFAULT 'Preventive',
  description text DEFAULT '',
  cost decimal(12,2) DEFAULT 0,
  vendor text DEFAULT '',
  technician text DEFAULT '',
  status text DEFAULT 'Scheduled',
  scheduled_date timestamptz,
  completed_date timestamptz,
  next_maintenance_date timestamptz,
  parts_used text[] DEFAULT '{}',
  incident_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all maintenance records"
  ON maintenance_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage maintenance records"
  ON maintenance_records
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_maintenance_records_updated_at 
  BEFORE UPDATE ON maintenance_records 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();