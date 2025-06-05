-- Drop conflicting policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can create their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can update their own hustles" ON hustles;
  DROP POLICY IF EXISTS "Users can delete their own hustles" ON hustles;
  DROP POLICY IF EXISTS "hustles_view_own" ON hustles;
  DROP POLICY IF EXISTS "hustles_insert_own" ON hustles;
  DROP POLICY IF EXISTS "hustles_update_own" ON hustles;
  DROP POLICY IF EXISTS "hustles_delete_own" ON hustles;
END $$;

-- Create new unified policies
CREATE POLICY "hustles_select" ON hustles
FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "hustles_insert" ON hustles
FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "hustles_update" ON hustles
FOR UPDATE USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "hustles_delete" ON hustles
FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Ensure templates are publicly readable
CREATE POLICY "templates_public_read" ON templates
FOR SELECT USING (true);

-- Refresh the sample data
TRUNCATE templates, hustles CASCADE;

-- Re-insert sample data
INSERT INTO templates (
  title, description, technologies, complexity, setup_time,
  repository_url, preview_url, image_url, author_id,
  features, requirements, installation, configuration,
  category, framework, license, version
) VALUES
  (
    'SaaS Starter Kit',
    'A complete SaaS boilerplate with authentication, payments, and user management.',
    ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    'intermediate',
    15,
    'https://github.com/example/saas-starter',
    'https://demo.example.com',
    'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    auth.uid(),
    ARRAY['Authentication', 'Payments', 'User Management'],
    ARRAY['Node.js 18+', 'npm or yarn'],
    'Clone repository and run npm install',
    'Set environment variables and configure API keys',
    'Full Stack',
    'Next.js',
    'MIT',
    '1.0.0'
  );

INSERT INTO hustles (
  title, description, tags, status, user_id,
  time_commitment, earning_potential, image, tools,
  category
) VALUES
  (
    'AI Code Review Assistant',
    'Build a VS Code extension that uses AI to review code and suggest improvements.',
    ARRAY['ai', 'developer-tools', 'vscode'],
    'saved',
    auth.uid(),
    'medium',
    'high',
    'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    ARRAY['TypeScript', 'VS Code API', 'OpenAI API'],
    'Developer Tools'
  );