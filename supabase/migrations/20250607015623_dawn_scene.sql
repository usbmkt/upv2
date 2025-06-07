/*
  # Enhanced schema for Launch Master

  1. New Tables
    - user_settings
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - theme (text)
      - language (text)
      - timezone (text)
      - notifications_enabled (boolean)
      - email_notifications (boolean)
      - default_phase_durations (jsonb)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - project_templates
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - name (text)
      - description (text, nullable)
      - phases (jsonb)
      - is_public (boolean)
      - created_at (timestamp)

  2. Enhanced Projects Table
    - Add priority column
    - Add budget column
    - Add team column (jsonb array)
    - Add tags column (jsonb array)

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add new columns to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'priority'
  ) THEN
    ALTER TABLE projects ADD COLUMN priority text DEFAULT 'media';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'budget'
  ) THEN
    ALTER TABLE projects ADD COLUMN budget numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'team'
  ) THEN
    ALTER TABLE projects ADD COLUMN team jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'tags'
  ) THEN
    ALTER TABLE projects ADD COLUMN tags jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme text DEFAULT 'system',
  language text DEFAULT 'pt-BR',
  timezone text DEFAULT 'America/Sao_Paulo',
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  default_phase_durations jsonb DEFAULT '{
    "planejamento": {"name": "Planejamento", "days": 30, "color": "#3B82F6"},
    "aquisicao": {"name": "Aquisição", "days": 21, "color": "#10B981"},
    "aquecimento": {"name": "Aquecimento", "days": 7, "color": "#F59E0B"},
    "evento": {"name": "Evento", "days": 3, "color": "#8B5CF6"},
    "carrinho": {"name": "Carrinho Aberto", "days": 7, "color": "#EC4899"},
    "recuperacao": {"name": "Recuperação", "days": 14, "color": "#F97316"},
    "downsell": {"name": "Downsell", "days": 7, "color": "#EF4444"},
    "debriefing": {"name": "Debriefing", "days": 7, "color": "#6B7280"}
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create project_templates table
CREATE TABLE IF NOT EXISTS project_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  phases jsonb NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own templates"
  ON project_templates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read public templates"
  ON project_templates
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_settings
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_project_templates_user_id ON project_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_project_templates_public ON project_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_event_date ON projects(event_date);