/*
  # Add Hustle Management Constraints and Indexes

  1. Changes
    - Add check constraints for status and time_commitment
    - Add indexes for efficient querying
    - Add trigger for updated_at timestamp

  2. Security
    - Ensure RLS policies are in place
    - Add policies for CRUD operations
*/

-- Add check constraints
ALTER TABLE hustles
ADD CONSTRAINT hustles_status_check 
CHECK (status IN ('saved', 'in-progress', 'launched'));

ALTER TABLE hustles
ADD CONSTRAINT hustles_time_commitment_check 
CHECK (time_commitment IN ('low', 'medium', 'high'));

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS hustles_user_id_idx ON hustles(user_id);
CREATE INDEX IF NOT EXISTS hustles_status_idx ON hustles(status);
CREATE INDEX IF NOT EXISTS hustles_created_at_idx ON hustles(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hustles_updated_at
    BEFORE UPDATE ON hustles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE hustles ENABLE ROW LEVEL SECURITY;

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