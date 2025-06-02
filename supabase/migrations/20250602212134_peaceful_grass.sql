/*
  # Add Additional Hustle Features

  1. New Tables
    - hustle_comments: For user discussions
    - hustle_likes: For tracking favorites
    - hustle_resources: For related materials
    - templates: For starter projects
    
  2. Changes to Hustles Table
    - Add version tracking
    - Add collaboration fields
    - Add progress metrics
    - Add revenue tracking
    
  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create hustle_comments table
CREATE TABLE IF NOT EXISTS hustle_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES hustle_comments(id) ON DELETE CASCADE
);

-- Create hustle_likes table
CREATE TABLE IF NOT EXISTS hustle_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  UNIQUE(hustle_id, user_id)
);

-- Create hustle_resources table
CREATE TABLE IF NOT EXISTS hustle_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('link', 'document', 'video', 'repository')),
  description TEXT
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  complexity TEXT NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced')),
  setup_time INTEGER NOT NULL,
  repository_url TEXT NOT NULL,
  preview_url TEXT,
  image_url TEXT NOT NULL
);

-- Add new columns to hustles table
ALTER TABLE hustles
ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS collaborators UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS progress INTEGER CHECK (progress BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS revenue_target DECIMAL,
ADD COLUMN IF NOT EXISTS current_revenue DECIMAL DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS launch_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_milestone TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS hustle_comments_hustle_id_idx ON hustle_comments(hustle_id);
CREATE INDEX IF NOT EXISTS hustle_comments_user_id_idx ON hustle_comments(user_id);
CREATE INDEX IF NOT EXISTS hustle_likes_hustle_id_idx ON hustle_likes(hustle_id);
CREATE INDEX IF NOT EXISTS hustle_likes_user_id_idx ON hustle_likes(user_id);
CREATE INDEX IF NOT EXISTS hustle_resources_hustle_id_idx ON hustle_resources(hustle_id);
CREATE INDEX IF NOT EXISTS templates_technologies_idx ON templates USING gin(technologies);

-- Enable RLS on new tables
ALTER TABLE hustle_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hustle_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hustle_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policies for hustle_comments
CREATE POLICY "Users can view comments on accessible hustles"
ON hustle_comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM hustles
    WHERE hustles.id = hustle_comments.hustle_id
    AND hustles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create comments on accessible hustles"
ON hustle_comments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM hustles
    WHERE hustles.id = hustle_comments.hustle_id
    AND hustles.user_id = auth.uid()
  )
);

-- Create policies for hustle_likes
CREATE POLICY "Users can view their own likes"
ON hustle_likes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own likes"
ON hustle_likes FOR ALL USING (auth.uid() = user_id);

-- Create policies for hustle_resources
CREATE POLICY "Users can view resources of accessible hustles"
ON hustle_resources FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM hustles
    WHERE hustles.id = hustle_resources.hustle_id
    AND hustles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage resources of their hustles"
ON hustle_resources FOR ALL USING (
  EXISTS (
    SELECT 1 FROM hustles
    WHERE hustles.id = hustle_resources.hustle_id
    AND hustles.user_id = auth.uid()
  )
);

-- Create policies for templates
CREATE POLICY "Anyone can view templates"
ON templates FOR SELECT USING (true);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_hustle_comments_updated_at
  BEFORE UPDATE ON hustle_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hustle_resources_updated_at
  BEFORE UPDATE ON hustle_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();