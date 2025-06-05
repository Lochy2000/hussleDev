/*
  # Add Templates Table and Functions

  1. New Tables
    - templates: Stores project templates with metadata
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - technologies (text[])
      - complexity (enum)
      - setup_time (integer)
      - repository_url (text)
      - preview_url (text, nullable)
      - image_url (text)
      - stars (integer)
      - downloads (integer)
      - author_id (uuid)
      - features (text[])
      - requirements (text[])
      - installation (text)
      - configuration (text)
      - category (text)
      - framework (text)
      - license (text)
      - version (text)
      - timestamps

  2. Functions
    - increment_template_downloads: Safely increments download count

  3. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for author management
*/

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  complexity TEXT NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced')),
  setup_time INTEGER NOT NULL,
  repository_url TEXT NOT NULL,
  preview_url TEXT,
  image_url TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  features TEXT[] NOT NULL DEFAULT '{}',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  installation TEXT NOT NULL,
  configuration TEXT NOT NULL,
  category TEXT NOT NULL,
  framework TEXT NOT NULL,
  license TEXT NOT NULL,
  version TEXT NOT NULL
);

-- Create indexes
CREATE INDEX templates_technologies_idx ON templates USING gin (technologies);
CREATE INDEX templates_complexity_idx ON templates (complexity);
CREATE INDEX templates_category_idx ON templates (category);
CREATE INDEX templates_framework_idx ON templates (framework);
CREATE INDEX templates_downloads_idx ON templates (downloads DESC);
CREATE INDEX templates_stars_idx ON templates (stars DESC);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Templates are viewable by everyone" 
ON templates FOR SELECT 
USING (true);

CREATE POLICY "Authors can insert their own templates" 
ON templates FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own templates" 
ON templates FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own templates" 
ON templates FOR DELETE 
USING (auth.uid() = author_id);

-- Create function to increment downloads
CREATE OR REPLACE FUNCTION increment_template_downloads(template_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE templates
  SET downloads = downloads + 1
  WHERE id = template_id;
END;
$$;

-- Create updated_at trigger
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();