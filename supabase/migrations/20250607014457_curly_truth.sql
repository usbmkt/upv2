/*
  # Database Setup Script
  
  Run this script in your Supabase SQL Editor to create the required tables.
  
  1. Go to your Supabase Dashboard
  2. Navigate to the SQL Editor
  3. Copy and paste this entire script
  4. Click "Run" to execute
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  client text,
  description text,
  event_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'planning',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Users can CRUD own projects" ON projects;
CREATE POLICY "Users can CRUD own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Users can CRUD own project phases" ON phases;
CREATE POLICY "Users can CRUD own project phases"
  ON phases
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.user_id = auth.uid()
    )
  );