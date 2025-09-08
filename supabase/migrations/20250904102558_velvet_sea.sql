/*
  # Create assets table for IT Asset Management

  1. New Tables
    - `assets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `tag` (text, unique)
      - `category` (text)
      - `subcategory` (text)
      - `model` (text)
      - `manufacturer` (text)
      - `serial_number` (text)
      - `status` (text)
      - `assigned_to` (uuid, foreign key to users)
      - `assigned_department` (text)
      - `location` (jsonb)
      - `purchase_date` (date)
      - `purchase_cost` (decimal)
      - `warranty_expiry` (date)
      - `warranty_status` (text)
      - `notes` (text)
      - `barcode` (text)
      - `qr_code` (text)
      - `specifications` (jsonb)
      - `lifecycle_stage` (text)
      - `compliance_status` (text)
      - `discovery_source` (text)
      - `last_audit_date` (date)
      - `next_maintenance_date` (date)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `assets` table
    - Add policies for authenticated users to manage assets
*/

CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  tag text UNIQUE NOT NULL,
  category text DEFAULT '',
  subcategory text DEFAULT '',
  model text DEFAULT '',
  manufacturer text DEFAULT '',
  serial_number text DEFAULT '',
  status text DEFAULT 'Active',
  assigned_to uuid REFERENCES users(id),
  assigned_department text DEFAULT '',
  location jsonb DEFAULT '{}',
  purchase_date date,
  purchase_cost decimal(12,2) DEFAULT 0,
  warranty_expiry date,
  warranty_status text DEFAULT 'Active',
  notes text DEFAULT '',
  barcode text DEFAULT '',
  qr_code text DEFAULT '',
  specifications jsonb DEFAULT '{}',
  lifecycle_stage text DEFAULT 'Active',
  compliance_status text DEFAULT 'Compliant',
  discovery_source text DEFAULT '',
  last_audit_date date,
  next_maintenance_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all assets"
  ON assets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage assets"
  ON assets
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_assets_updated_at 
  BEFORE UPDATE ON assets 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();