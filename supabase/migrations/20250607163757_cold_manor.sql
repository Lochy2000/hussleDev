/*
  # Add Task Management System

  1. New Tables
    - `hustle_tasks` - For breaking down hustles into actionable tasks
      - `id` (uuid, primary key)
      - `hustle_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `category` (text) - development, design, marketing, research, testing
      - `status` (text) - todo, in-progress, completed
      - `priority` (text) - low, medium, high
      - `estimated_hours` (integer)
      - `actual_hours` (integer)
      - `due_date` (timestamptz)
      - `depends_on` (uuid[]) - task dependencies
      - `ai_generated` (boolean) - whether task was AI-generated
      - `order_index` (integer) - for task ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Functions
    - `update_hustle_progress` - Auto-calculate progress from completed tasks

  3. Security
    - Enable RLS on tasks table
    - Add policies for task access control
*/

-- Create hustle_tasks table
CREATE TABLE IF NOT EXISTS hustle_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'development' CHECK (category IN ('development', 'design', 'marketing', 'research', 'testing', 'planning', 'deployment')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  estimated_hours INTEGER DEFAULT 0,
  actual_hours INTEGER DEFAULT 0,
  due_date TIMESTAMPTZ,
  depends_on UUID[] DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Create function to auto-update hustle progress based on completed tasks
CREATE OR REPLACE FUNCTION update_hustle_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  progress_percentage INTEGER;
BEGIN
  -- Count total and completed tasks for the hustle
  SELECT COUNT(*) INTO total_tasks
  FROM hustle_tasks
  WHERE hustle_id = COALESCE(NEW.hustle_id, OLD.hustle_id);

  SELECT COUNT(*) INTO completed_tasks
  FROM hustle_tasks
  WHERE hustle_id = COALESCE(NEW.hustle_id, OLD.hustle_id)
    AND status = 'completed';

  -- Calculate progress percentage
  IF total_tasks > 0 THEN
    progress_percentage := ROUND((completed_tasks::DECIMAL / total_tasks::DECIMAL) * 100);
  ELSE
    progress_percentage := 0;
  END IF;

  -- Update the hustle progress
  UPDATE hustles
  SET progress = progress_percentage,
      updated_at = timezone('utc', now())
  WHERE id = COALESCE(NEW.hustle_id, OLD.hustle_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE hustle_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for hustle_tasks
CREATE POLICY "Users can view tasks for their hustles"
  ON hustle_tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hustles
      WHERE hustles.id = hustle_tasks.hustle_id
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks for their hustles"
  ON hustle_tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hustles
      WHERE hustles.id = hustle_tasks.hustle_id
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks for their hustles"
  ON hustle_tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hustles
      WHERE hustles.id = hustle_tasks.hustle_id
      AND hustles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hustles
      WHERE hustles.id = hustle_tasks.hustle_id
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks for their hustles"
  ON hustle_tasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hustles
      WHERE hustles.id = hustle_tasks.hustle_id
      AND hustles.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS hustle_tasks_hustle_id_idx ON hustle_tasks (hustle_id);
CREATE INDEX IF NOT EXISTS hustle_tasks_status_idx ON hustle_tasks (status);
CREATE INDEX IF NOT EXISTS hustle_tasks_category_idx ON hustle_tasks (category);
CREATE INDEX IF NOT EXISTS hustle_tasks_order_idx ON hustle_tasks (hustle_id, order_index);

-- Create trigger to auto-update hustle progress
CREATE TRIGGER update_hustle_progress_trigger
  AFTER INSERT OR UPDATE OR DELETE ON hustle_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_hustle_progress();

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_hustle_tasks_updated_at
  BEFORE UPDATE ON hustle_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();