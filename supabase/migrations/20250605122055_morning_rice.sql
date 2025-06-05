/*
  # Add Templates and Admin Functionality

  1. New Tables
    - templates: For storing project starter templates
      - Basic info (title, description, etc.)
      - Technical details (technologies, complexity, etc.)
      - Stats (stars, downloads)
      - Content (features, requirements, etc.)
    - admin_users: For managing admin access
      - User ID reference
      - Role (admin, moderator, editor)
      - Permissions
    - content_updates: For tracking content changes
      - Change details
      - User reference
      - Timestamps

  2. Functions
    - increment_template_downloads: For tracking template usage
    - add_admin: For managing admin users

  3. Security
    - RLS policies for all tables
    - Role-based access control
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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'templates' 
    AND policyname = 'Anyone can view templates'
  ) THEN
    CREATE POLICY "Anyone can view templates"
      ON templates
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'templates' 
    AND policyname = 'Admins can insert templates'
  ) THEN
    CREATE POLICY "Admins can insert templates"
      ON templates
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'templates' 
    AND policyname = 'Admins can update templates'
  ) THEN
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
  END IF;
END $$;

-- Admin users policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_users' 
    AND policyname = 'Admins can view admin users'
  ) THEN
    CREATE POLICY "Admins can view admin users"
      ON admin_users
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_users' 
    AND policyname = 'Super admins can manage admin users'
  ) THEN
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
  END IF;
END $$;

-- Content updates policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'content_updates' 
    AND policyname = 'Admins can view content updates'
  ) THEN
    CREATE POLICY "Admins can view content updates"
      ON content_updates
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'content_updates' 
    AND policyname = 'System can insert content updates'
  ) THEN
    CREATE POLICY "System can insert content updates"
      ON content_updates
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

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