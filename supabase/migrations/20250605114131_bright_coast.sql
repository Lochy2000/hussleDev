-- First, let's ensure we have at least one admin user
INSERT INTO auth.users (id, email)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@hustle.dev')
ON CONFLICT (id) DO NOTHING;

-- Make them an admin
INSERT INTO admin_users (user_id, role, permissions)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin', '{"all"}')
ON CONFLICT (user_id) DO NOTHING;

-- Update existing content to have valid owners
UPDATE templates 
SET author_id = '00000000-0000-0000-0000-000000000001'
WHERE author_id IS NULL OR author_id = '00000000-0000-0000-0000-000000000000';

UPDATE hustles 
SET user_id = '00000000-0000-0000-0000-000000000001'
WHERE user_id IS NULL OR user_id = '00000000-0000-0000-0000-000000000000';

-- Add some sample content with proper ownership
INSERT INTO templates (
  title, description, technologies, complexity, setup_time,
  repository_url, preview_url, image_url, author_id,
  features, requirements, installation, configuration,
  category, framework, license, version
) VALUES
  (
    'Developer Portfolio Pro',
    'Modern portfolio template with blog, project showcase, and analytics.',
    ARRAY['React', 'Next.js', 'Tailwind CSS', 'MDX'],
    'beginner',
    10,
    'https://github.com/example/portfolio-pro',
    'https://portfolio-pro.demo.com',
    'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
    '00000000-0000-0000-0000-000000000001',
    ARRAY['Blog', 'Project Showcase', 'Analytics', 'SEO'],
    ARRAY['Node.js 18+', 'npm or yarn'],
    'Simple one-command setup process',
    'Easy customization through config files',
    'Portfolio',
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
    'Code Review AI Assistant',
    'Build an AI-powered code review tool that integrates with GitHub.',
    ARRAY['ai', 'github', 'developer-tools'],
    'saved',
    '00000000-0000-0000-0000-000000000001',
    'medium',
    'high',
    'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    ARRAY['Python', 'OpenAI API', 'GitHub API'],
    'Developer Tools'
  );