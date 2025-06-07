# Database Setup Instructions

Your application is failing because the database tables don't exist yet. You need to manually apply the migrations to your Supabase database.

## Steps to Fix:

1. **Open your Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the First Migration**
   - Copy and paste the content from `supabase/migrations/20250606022226_cold_lagoon.sql`
   - Click "Run" to execute the SQL

4. **Run the Second Migration**
   - Copy and paste the content from `supabase/migrations/20250607014457_curly_truth.sql`
   - Click "Run" to execute the SQL

## Migration Files Content:

### First Migration (20250606022226_cold_lagoon.sql):
```sql
/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `client` (text, optional)
      - `description` (text, optional)
      - `event_date` (timestamp)
      - `status` (text, default 'planning')
      - `created_at` (timestamp)
    - `phases`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `name` (text)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `duration` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (uid() = id);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  USING (uid() = user_id)
  WITH CHECK (uid() = user_id);

-- Create phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
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
      AND projects.user_id = uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = phases.project_id 
      AND projects.user_id = uid()
    )
  );
```

### Second Migration (20250607014457_curly_truth.sql):
```sql
/*
  # Fix users table default value

  1. Changes
    - Update users table id column to use gen_random_uuid() instead of uid()
    - This ensures compatibility with standard UUID generation
*/

-- Update the users table to use gen_random_uuid() for id generation
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();
```

## After Running the Migrations:

1. **Verify Tables Were Created**
   - In Supabase Dashboard, go to "Table Editor"
   - You should see `users`, `projects`, and `phases` tables

2. **Restart Your Application**
   - The error should be resolved and your app should work properly

## Alternative: Quick Setup SQL

If you prefer, you can run this complete SQL script in one go:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
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
```

Once you've run the SQL migrations in your Supabase dashboard, your application should work correctly!