/*
  # Templates and Admin System

  1. New Tables
    - `templates` - For storing project templates
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `title` (text)
      - `description` (text)
      - `technologies` (text[])
      - `complexity` (enum: beginner, intermediate, advanced)
      - `setup_time` (integer)
      - `repository_url` (text)
      - `preview_url` (text, nullable)
      - `image_url` (text)
      - `stars` (integer)
      - `downloads` (integer)
      - `author_id` (uuid)
      - `features` (text[])
      - `requirements` (text[])
      - `installation` (text)
      - `configuration` (text)
      - `category` (text)
      - `framework` (text)
      - `license` (text)
      - `version` (text)

    - `admin_users` - For managing admin access
      - `user_id` (uuid, primary key)
      - `role` (text)
      - `permissions` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `content_updates` - For tracking content changes
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `user_id` (uuid)
      - `content_type` (text)
      - `content_id` (text)
      - `action` (text)
      - `changes` (jsonb)

  2. Functions
    - `increment_template_downloads` - For tracking template downloads
    - `add_admin` - For adding new admin users
    - `update_updated_at_column` - Trigger function for updating timestamps

  3. Security
    - Enable RLS on all tables
    - Add policies for templates and admin access
*/

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  complexity TEXT NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced')),
  setup_time INTEGER NOT NULL,
  repository_url TEXT NOT NULL,
  preview_url TEXT,
  image_url TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  features TEXT[] NOT NULL DEFAULT '{}',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  installation TEXT NOT NULL,
  configuration TEXT NOT NULL,
  category TEXT NOT NULL,
  framework TEXT NOT NULL,
  license TEXT NOT NULL,
  version TEXT NOT NULL
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'editor')),
  permissions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Create content_updates table
CREATE TABLE IF NOT EXISTS content_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  action TEXT NOT NULL,
  changes JSONB NOT NULL
);

-- Create function to increment template downloads
CREATE OR REPLACE FUNCTION increment_template_downloads(template_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE templates
  SET downloads = downloads + 1
  WHERE id = template_id;
END;
$$;

-- Create function to add admin users
CREATE OR REPLACE FUNCTION add_admin(admin_user_id UUID, admin_role TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_users (user_id, role)
  VALUES (admin_user_id, admin_role);
END;
$$;

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_updates ENABLE ROW LEVEL SECURITY;

-- Templates policies
CREATE POLICY "Anyone can view templates"
  ON templates
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert templates"
  ON templates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update templates"
  ON templates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Admin users policies
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Content updates policies
CREATE POLICY "Admins can view content updates"
  ON content_updates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert content updates"
  ON content_updates
  FOR INSERT
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS templates_technologies_idx ON templates USING gin (technologies);
CREATE INDEX IF NOT EXISTS templates_downloads_idx ON templates (downloads DESC);
CREATE INDEX IF NOT EXISTS templates_stars_idx ON templates (stars DESC);
CREATE INDEX IF NOT EXISTS templates_complexity_idx ON templates (complexity);
CREATE INDEX IF NOT EXISTS templates_category_idx ON templates (category);
CREATE INDEX IF NOT EXISTS templates_framework_idx ON templates (framework);

-- Create triggers
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();