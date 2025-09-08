/*
  # Create integrations table for IT Asset Management

  1. New Tables
    - `integrations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `endpoint` (text)
      - `api_key` (text)
      - `last_sync` (timestamptz)
      - `sync_frequency` (text)
      - `status` (text)
      - `mappings` (jsonb)
      - `error_log` (jsonb)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `integrations` table
    - Add policies for authenticated users to manage integrations
*/

CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  type text DEFAULT 'Discovery Tool',
  endpoint text DEFAULT '',
  api_key text DEFAULT '',
  last_sync timestamptz DEFAULT now(),
  sync_frequency text DEFAULT 'Daily',
  status text DEFAULT 'Active',
  mappings jsonb DEFAULT '[]',
  error_log jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all integrations"
  ON integrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage integrations"
  ON integrations
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_integrations_updated_at 
  BEFORE UPDATE ON integrations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();