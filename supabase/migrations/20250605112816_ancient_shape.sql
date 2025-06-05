/*
  # Update Database Policies and Content

  1. Changes
    - Drop existing policies if needed
    - Create new policies with unique names
    - Add new content to tables
  
  2. Security
    - Maintain RLS
    - Update access controls
    - Ensure data integrity
*/

-- First, let's check if policies exist and drop them if needed
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hustles' 
    AND policyname = 'Users can view their own hustles'
  ) THEN
    DROP POLICY IF EXISTS "Users can view their own hustles" ON hustles;
  END IF;
END $$;

-- Create new policies with unique names
CREATE POLICY "hustles_view_own" ON hustles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "hustles_insert_own" ON hustles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "hustles_update_own" ON hustles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "hustles_delete_own" ON hustles
FOR DELETE USING (auth.uid() = user_id);

-- Add new content
INSERT INTO hustles (
  title, description, tags, status, user_id,
  time_commitment, earning_potential, image, tools,
  category
) VALUES
  (
    'Developer Learning Platform',
    'Create an interactive platform for developers to learn and practice coding with real-time feedback.',
    ARRAY['education', 'coding', 'platform'],
    'saved',
    auth.uid(),
    'high',
    'high',
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
    ARRAY['React', 'Node.js', 'MongoDB', 'WebSocket'],
    'Education'
  ),
  (
    'Code Deployment Assistant',
    'Build a tool that helps developers automate their deployment processes with best practices.',
    ARRAY['devops', 'automation', 'tools'],
    'saved',
    auth.uid(),
    'medium',
    'medium',
    'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    ARRAY['Python', 'Docker', 'Kubernetes'],
    'DevOps'
  );