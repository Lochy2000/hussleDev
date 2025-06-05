-- First, drop all existing policies
DO $$ 
BEGIN
  -- Drop hustle policies if they exist
  DROP POLICY IF EXISTS "Users can view their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can create their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can update their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can delete their own hustles" ON hustles;
  DROP POLICY IF EXISTS "hustle_select" ON hustles;
  DROP POLICY IF EXISTS "hustle_insert" ON hustles;
  DROP POLICY IF EXISTS "hustle_update" ON hustles;
  DROP POLICY IF EXISTS "hustle_delete" ON hustles;

  -- Drop template policies if they exist
  DROP POLICY IF EXISTS "template_select" ON templates;
  DROP POLICY IF EXISTS "template_insert" ON templates;
  DROP POLICY IF EXISTS "template_update" ON templates;
  DROP POLICY IF EXISTS "template_delete" ON templates;
END $$;

-- Create fresh policies for hustles
CREATE POLICY "hustle_select" ON hustles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "hustle_insert" ON hustles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "hustle_update" ON hustles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "hustle_delete" ON hustles FOR DELETE
USING (auth.uid() = user_id);

-- Create fresh policies for templates
CREATE POLICY "template_select" ON templates FOR SELECT
USING (true);

CREATE POLICY "template_insert" ON templates FOR INSERT
WITH CHECK (author_id = auth.uid());

CREATE POLICY "template_update" ON templates FOR UPDATE
USING (author_id = auth.uid());

CREATE POLICY "template_delete" ON templates FOR DELETE
USING (author_id = auth.uid());