/*
  # Add Admin Features

  1. New Tables
    - `admin_users`: Tracks users with admin privileges
    - `content_updates`: Logs content changes for auditing

  2. Security
    - Enable RLS on new tables
    - Add policies for admin access
    - Add functions for admin operations

  3. Changes
    - Add admin-specific columns to templates and hustles
    - Add functions for content management
*/

-- Create admin_users table
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'editor')),
  permissions TEXT[] NOT NULL DEFAULT '{}'
);

-- Create content_updates table for audit logging
CREATE TABLE content_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  action TEXT NOT NULL,
  changes JSONB NOT NULL
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_updates ENABLE ROW LEVEL SECURITY;

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = $1
  );
END;
$$;

-- Create function to add admin
CREATE OR REPLACE FUNCTION add_admin(
  admin_user_id UUID,
  admin_role TEXT DEFAULT 'editor',
  admin_permissions TEXT[] DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_users (user_id, role, permissions)
  VALUES (admin_user_id, admin_role, admin_permissions);
END;
$$;

-- Create function to log content updates
CREATE OR REPLACE FUNCTION log_content_update(
  content_type TEXT,
  content_id UUID,
  action TEXT,
  changes JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO content_updates (user_id, content_type, content_id, action, changes)
  VALUES (auth.uid(), content_type, content_id, action, changes);
END;
$$;

-- Add policies for admin_users
CREATE POLICY "Admins can view admin users"
ON admin_users
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin users"
ON admin_users
FOR ALL
USING (EXISTS (
  SELECT 1 FROM admin_users
  WHERE user_id = auth.uid()
  AND role = 'admin'
));

-- Add policies for content_updates
CREATE POLICY "Admins can view content updates"
ON content_updates
FOR SELECT
USING (is_admin(auth.uid()));

-- Add admin-specific policies to templates
CREATE POLICY "Admins can manage all templates"
ON templates
FOR ALL
USING (is_admin(auth.uid()));

-- Add admin-specific policies to hustles
CREATE POLICY "Admins can manage all hustles"
ON hustles
FOR ALL
USING (is_admin(auth.uid()));

-- Add triggers for logging
CREATE OR REPLACE FUNCTION trigger_log_template_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_content_update('template', NEW.id, 'insert', row_to_json(NEW)::jsonb);
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_content_update('template', NEW.id, 'update', jsonb_build_object(
      'old', row_to_json(OLD)::jsonb,
      'new', row_to_json(NEW)::jsonb
    ));
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_content_update('template', OLD.id, 'delete', row_to_json(OLD)::jsonb);
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION trigger_log_hustle_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_content_update('hustle', NEW.id, 'insert', row_to_json(NEW)::jsonb);
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_content_update('hustle', NEW.id, 'update', jsonb_build_object(
      'old', row_to_json(OLD)::jsonb,
      'new', row_to_json(NEW)::jsonb
    ));
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_content_update('hustle', OLD.id, 'delete', row_to_json(OLD)::jsonb);
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER log_template_changes
AFTER INSERT OR UPDATE OR DELETE ON templates
FOR EACH ROW EXECUTE FUNCTION trigger_log_template_changes();

CREATE TRIGGER log_hustle_changes
AFTER INSERT OR UPDATE OR DELETE ON hustles
FOR EACH ROW EXECUTE FUNCTION trigger_log_hustle_changes();