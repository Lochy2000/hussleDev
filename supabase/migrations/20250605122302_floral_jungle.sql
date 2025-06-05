/*
  # Fix triggers with DO blocks

  1. Changes
    - Add DO blocks for trigger creation to prevent duplicates
    - Drop existing triggers before recreation
    - Keep all other functionality intact

  2. Security
    - Maintain existing RLS policies
    - Keep all security checks
*/

-- Drop and recreate triggers using DO blocks
DO $$
BEGIN
  -- Drop existing triggers if they exist
  DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
  DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;

  -- Recreate triggers
  CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;