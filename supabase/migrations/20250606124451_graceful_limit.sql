/*
  # Fix RLS policies for explore page

  1. Security Changes
    - Update hustles table policies to allow viewing all hustles
    - Keep write operations restricted to hustle owners
    - Allow public read access for explore functionality

  2. Policy Updates
    - Modify SELECT policy to allow viewing all hustles
    - Keep INSERT, UPDATE, DELETE policies restricted to owners
*/

-- Drop existing SELECT policy for hustles
DROP POLICY IF EXISTS "Users can view their own hustles" ON hustles;

-- Create new policy that allows viewing all hustles
CREATE POLICY "Anyone can view all hustles"
  ON hustles
  FOR SELECT
  USING (true);

-- Ensure other policies remain restrictive for write operations
-- (These should already exist, but let's make sure they're correct)

-- Users can only insert hustles for themselves
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hustles' 
    AND policyname = 'Users can create their own hustles'
  ) THEN
    CREATE POLICY "Users can create their own hustles"
      ON hustles
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Users can only update their own hustles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hustles' 
    AND policyname = 'Users can update their own hustles'
  ) THEN
    CREATE POLICY "Users can update their own hustles"
      ON hustles
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Users can only delete their own hustles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hustles' 
    AND policyname = 'Users can delete their own hustles'
  ) THEN
    CREATE POLICY "Users can delete their own hustles"
      ON hustles
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;