/*
  # Add hustle management fields

  1. New Fields
    - `priority` (text) - Priority level of the hustle
    - `due_date` (timestamptz) - Optional due date
    - `milestones` (jsonb) - Array of milestone objects
    - `github_url` (text) - Optional GitHub repository URL
    - `website_url` (text) - Optional live website URL

  2. Changes
    - Add check constraint for priority values
    - Add index for due_date for better query performance
*/

-- Add new columns to hustles table
ALTER TABLE hustles
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Create index for due_date
CREATE INDEX IF NOT EXISTS hustles_due_date_idx ON hustles(due_date);

-- Update RLS policies to include new fields
DROP POLICY IF EXISTS "Users can update their own hustles" ON hustles;
CREATE POLICY "Users can update their own hustles"
ON hustles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);