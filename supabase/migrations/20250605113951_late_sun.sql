-- Drop all existing policies to start fresh
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
  
  -- Drop template policies
  DROP POLICY IF EXISTS "Templates are viewable by everyone" ON templates;
  DROP POLICY IF EXISTS "Authors can insert their own templates" ON templates;
  DROP POLICY IF EXISTS "Authors can update their own templates" ON templates;
  DROP POLICY IF EXISTS "Authors can delete their own templates" ON templates;
  DROP POLICY IF EXISTS "templates_public_read" ON templates;
END $$;

-- Create new unified policies for hustles
CREATE POLICY "hustle_access_policy" ON hustles
FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Create new unified policies for templates
CREATE POLICY "template_read_policy" ON templates
FOR SELECT USING (true);

CREATE POLICY "template_write_policy" ON templates
FOR ALL USING (
  author_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  )
);