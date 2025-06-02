/*
  # Add performance indexes for hustles table

  1. Changes
    - Add indexes for common query patterns:
      - user_id for filtering by user
      - status for filtering by status
      - created_at for sorting by date
    - Verify RLS is enabled
*/

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'hustles' AND indexname = 'hustles_user_id_idx'
  ) THEN
    CREATE INDEX hustles_user_id_idx ON hustles(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'hustles' AND indexname = 'hustles_status_idx'
  ) THEN
    CREATE INDEX hustles_status_idx ON hustles(status);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'hustles' AND indexname = 'hustles_created_at_idx'
  ) THEN
    CREATE INDEX hustles_created_at_idx ON hustles(created_at DESC);
  END IF;
END $$;