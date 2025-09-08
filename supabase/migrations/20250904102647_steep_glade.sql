/*
  # Create compliance checks table for IT Asset Management

  1. New Tables
    - `compliance_checks`
      - `id` (uuid, primary key)
      - `type` (text)
      - `status` (text)
      - `last_checked` (timestamptz)
      - `next_check` (timestamptz)
      - `auditor` (text)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `policy_violations`
      - `id` (uuid, primary key)
      - `type` (text)
      - `severity` (text)
      - `description` (text)
      - `detected_date` (timestamptz)
      - `resolved_date` (timestamptz)
      - `assigned_to` (text)
      - `status` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage compliance data
*/

CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text DEFAULT 'License Compliance',
  status text DEFAULT 'Under Review',
  last_checked timestamptz DEFAULT now(),
  next_check timestamptz,
  auditor text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS policy_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text DEFAULT 'License Overuse',
  severity text DEFAULT 'Medium',
  description text DEFAULT '',
  detected_date timestamptz DEFAULT now(),
  resolved_date timestamptz,
  assigned_to text DEFAULT '',
  status text DEFAULT 'Open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all compliance checks"
  ON compliance_checks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage compliance checks"
  ON compliance_checks
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all policy violations"
  ON policy_violations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage policy violations"
  ON policy_violations
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_compliance_checks_updated_at 
  BEFORE UPDATE ON compliance_checks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policy_violations_updated_at 
  BEFORE UPDATE ON policy_violations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();