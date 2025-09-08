/*
  # Create import records table for IT Asset Management

  1. New Tables
    - `import_records`
      - `id` (uuid, primary key)
      - `file_name` (text)
      - `type` (text)
      - `status` (text)
      - `records_processed` (integer)
      - `total_records` (integer)
      - `errors` (text array)
      - `import_date` (timestamptz)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `import_records` table
    - Add policies for authenticated users to manage import records
*/

CREATE TABLE IF NOT EXISTS import_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL DEFAULT '',
  type text DEFAULT 'assets',
  status text DEFAULT 'pending',
  records_processed integer DEFAULT 0,
  total_records integer DEFAULT 0,
  errors text[] DEFAULT '{}',
  import_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE import_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all import records"
  ON import_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage import records"
  ON import_records
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_import_records_updated_at 
  BEFORE UPDATE ON import_records 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();