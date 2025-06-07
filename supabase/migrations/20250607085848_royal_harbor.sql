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

-- Drop existing SELECT policy for hustles (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hustles' 
    AND policyname = 'Users can view their own hustles'
  ) THEN
    DROP POLICY "Users can view their own hustles" ON hustles;
  END IF;
END $$;

-- Create new policy that allows viewing all hustles (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hustles' 
    AND policyname = 'Anyone can view all hustles'
  ) THEN
    CREATE POLICY "Anyone can view all hustles"
      ON hustles
      FOR SELECT
      USING (true);
  END IF;
END $$;

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

-- Users can insert their own hustles (alternative policy name check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hustles' 
    AND policyname = 'Users can insert their own hustles'
  ) THEN
    CREATE POLICY "Users can insert their own hustles"
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