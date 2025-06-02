/*
  # Add Hustle Table Indexes and Policies

  1. Changes
    - Add indexes for user_id, status, and created_at
    - Enable RLS on hustles table
    - Add policies for CRUD operations

  2. Security
    - Enable Row Level Security
    - Add policies for authenticated users to:
      - View their own hustles
      - Create new hustles
      - Update their hustles
      - Delete their hustles
*/

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS hustles_user_id_idx ON hustles(user_id);
CREATE INDEX IF NOT EXISTS hustles_status_idx ON hustles(status);
CREATE INDEX IF NOT EXISTS hustles_created_at_idx ON hustles(created_at DESC);

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