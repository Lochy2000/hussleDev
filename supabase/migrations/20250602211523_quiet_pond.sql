/*
  # Create Hustles Table

  1. New Tables
    - `hustles`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp) 
      - `title` (text)
      - `description` (text)
      - `tags` (text array)
      - `status` (text: saved, in-progress, launched)
      - `user_id` (uuid, references auth.users)
      - `notes` (text, nullable)
      - `time_commitment` (text: low, medium, high)
      - `earning_potential` (text: low, medium, high)
      - `image` (text)
      - `tools` (text array)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Only allow users to access their own hustles

  3. Indexes
    - Primary key on id
    - Index on user_id for faster lookups
    - Index on status for filtering
    - Index on created_at for sorting
*/

-- Create hustles table
CREATE TABLE IF NOT EXISTS hustles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('saved', 'in-progress', 'launched')),
  user_id UUID NOT NULL,
  notes TEXT,
  time_commitment TEXT NOT NULL CHECK (time_commitment IN ('low', 'medium', 'high')),
  earning_potential TEXT NOT NULL CHECK (earning_potential IN ('low', 'medium', 'high')),
  image TEXT NOT NULL,
  tools TEXT[] NOT NULL DEFAULT '{}'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS hustles_user_id_idx ON hustles(user_id);
CREATE INDEX IF NOT EXISTS hustles_status_idx ON hustles(status);
CREATE INDEX IF NOT EXISTS hustles_created_at_idx ON hustles(created_at DESC);

-- Create updated_at trigger
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