/*
  # Add Hustle table indexes and triggers
  
  1. Changes
    - Add index for created_at timestamp
    - Add updated_at trigger if not exists
    - Add RLS policies if not exist
  
  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Add index for created_at if not exists
CREATE INDEX IF NOT EXISTS hustles_created_at_idx ON hustles(created_at DESC);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_hustles_updated_at'
  ) THEN
    CREATE TRIGGER update_hustles_updated_at
      BEFORE UPDATE ON hustles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- Enable RLS if not already enabled
ALTER TABLE hustles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own hustles" ON hustles;
DROP POLICY IF EXISTS "Users can create their own hustles" ON hustles;
DROP POLICY IF EXISTS "Users can update their own hustles" ON hustles;
DROP POLICY IF EXISTS "Users can delete their own hustles" ON hustles;

-- Create policies
CREATE POLICY "Users can view their own hustles"
ON hustles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hustles"
ON hustles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hustles"
ON hustles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hustles"
ON hustles FOR DELETE
USING (auth.uid() = user_id);