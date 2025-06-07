/*
  # Initial schema setup for Launch Management System

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamp)
    
    - projects
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - name (text)
      - client (text, nullable)
      - description (text, nullable)
      - event_date (timestamp)
      - status (text)
      - created_at (timestamp)
    
    - phases
      - id (uuid, primary key)
      - project_id (uuid, foreign key)
      - name (text)
      - start_date (timestamp)
      - end_date (timestamp)
      - duration (integer)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create projects table
CREATE TABLE projects (
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

CREATE POLICY "Users can CRUD own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create phases table
CREATE TABLE phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

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