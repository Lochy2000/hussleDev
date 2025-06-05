-- Drop all existing policies
DO $$ 
BEGIN
  -- Drop hustle policies
  DROP POLICY IF EXISTS "Users can view their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can create their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can update their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can delete their own hustles" ON hustles;
  DROP POLICY IF EXISTS "hustles_view_own" ON hustles;
  DROP POLICY IF EXISTS "hustles_insert_own" ON hustles;
  DROP POLICY IF EXISTS "hustles_update_own" ON hustles;
  DROP POLICY IF EXISTS "hustles_delete_own" ON hustles;
  DROP POLICY IF EXISTS "hustles_select" ON hustles;
  DROP POLICY IF EXISTS "hustles_insert" ON hustles;
  DROP POLICY IF EXISTS "hustles_update" ON hustles;
  DROP POLICY IF EXISTS "hustles_delete" ON hustles;
  DROP POLICY IF EXISTS "hustle_access_policy" ON hustles;
  DROP POLICY IF EXISTS "hustle_read_policy" ON hustles;
  DROP POLICY IF EXISTS "hustle_write_policy" ON hustles;
  DROP POLICY IF EXISTS "hustle_update_policy" ON hustles;
  DROP POLICY IF EXISTS "hustle_delete_policy" ON hustles;
  
  -- Drop template policies
  DROP POLICY IF EXISTS "Templates are viewable by everyone" ON templates;
  DROP POLICY IF EXISTS "Authors can insert their own templates" ON templates;
  DROP POLICY IF EXISTS "Authors can update their own templates" ON templates;
  DROP POLICY IF EXISTS "Authors can delete their own templates" ON templates;
  DROP POLICY IF EXISTS "templates_public_read" ON templates;
  DROP POLICY IF EXISTS "template_read_policy" ON templates;
  DROP POLICY IF EXISTS "template_write_policy" ON templates;
  DROP POLICY IF EXISTS "template_update_policy" ON templates;
  DROP POLICY IF EXISTS "template_delete_policy" ON templates;
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