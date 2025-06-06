-- 1. [Optional] Create policy only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can view templates' 
      AND tablename = 'templates'
  ) THEN
    CREATE POLICY "Anyone can view templates"
    ON templates
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;

-- 2. Insert sample hustles (if needed, wrap with logic to avoid duplicates)
INSERT INTO hustles (
  title,
  description,
  tags,
  status,
  user_id,
  time_commitment,
  earning_potential,
  image,
  tools,
  category
) 
SELECT * FROM (VALUES 
(
  'Code Deployment Assistant',
  'Build a tool that helps developers automate their deployment processes with best practices.',
  ARRAY['devops', 'automation', 'tools'],
  'launched',
  '00000000-0000-0000-0000-000000000000',
  'medium',
  'medium',
  'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY['Python', 'Docker', 'Kubernetes'],
  'Developer Tool'
),
(
  'AI Proposal Writer for Freelancers',
  'A web-based tool that helps freelancers auto-generate project proposals based on client briefs using AI. Integrate form parsing, tone selection, and ready-to-send formatting.',
  ARRAY['ai', 'saas', '+2'],
  'launched',
  '00000000-0000-0000-0000-000000000000',
  'medium',
  'medium',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY['React', 'OpenAI API', 'Node.js'],
  'SaaS'
),
(
  'Chrome Extension for SEO',
  'CopyCheck: AI-Powered Website Copy Optimizer. Integrate with Zapier to auto-audit new landing pages on form submission.',
  ARRAY['no-code', 'chrome-extension', '+2'],
  'launched',
  '00000000-0000-0000-0000-000000000000',
  'medium',
  'medium',
  'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY['JavaScript', 'Chrome API', 'Zapier'],
  'Browser Extension'
),
(
  'Developer Portfolio Generator',
  'Create a tool that generates beautiful developer portfolio websites from GitHub profile and projects.',
  ARRAY['frontend', 'tool', 'beginner'],
  'in-progress',
  '00000000-0000-0000-0000-000000000000',
  'low',
  'low',
  'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY['React', 'GitHub API'],
  'Developer Tool'
),
(
  'API Monitoring Service',
  'Create a service that monitors API endpoints for uptime, response time, and errors, and sends alerts when issues are detected.',
  ARRAY['backend', 'saas', 'intermediate'],
  'in-progress',
  '00000000-0000-0000-0000-000000000000',
  'medium',
  'high',
  'https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY['Node.js', 'Express', 'MongoDB', 'Redis'],
  'API Service'
),
(
  'Freelance Time Tracker',
  'Build a time tracking app specifically for freelance developers, with invoicing, client management, and project tracking.',
  ARRAY['fullstack', 'saas', 'intermediate'],
  'saved',
  '00000000-0000-0000-0000-000000000000',
  'medium',
  'medium',
  'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY['React', 'Node.js', 'Express', 'MongoDB'],
  'SaaS'
),
(
  'Tech Interview Prep Platform',
  'Create a platform for developers to practice technical interviews with coding challenges, mock interviews, and feedback.',
  ARRAY['fullstack', 'saas', 'advanced'],
  'saved',
  '00000000-0000-0000-0000-000000000000',
  'high',
  'high',
  'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
  'SaaS'
),
(
  'No-Code Website Builder',
  'Create a drag-and-drop website builder that generates clean, responsive HTML/CSS code.',
  ARRAY['fullstack', 'saas', 'advanced'],
  'saved',
  '00000000-0000-0000-0000-000000000000',
  'high',
  'high',
  'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY['React', 'Node.js', 'Express', 'PostgreSQL'],
  'SaaS'
)
) AS v(title, description, tags, status, user_id, time_commitment, earning_potential, image, tools, category)
WHERE NOT EXISTS (
  SELECT 1 FROM hustles 
  WHERE title = v.title AND user_id = '00000000-0000-0000-0000-000000000000'
);

-- 3. Insert sample templates data
INSERT INTO templates (
  title,
  description,
  technologies,
  complexity,
  setup_time,
  repository_url,
  preview_url,
  image_url,
  stars,
  downloads,
  author_id,
  features,
  requirements,
  installation,
  configuration,
  category,
  framework,
  license,
  version
)
SELECT * FROM (VALUES
(
  'SaaS Starter Kit',
  'A complete SaaS starter kit with authentication, payments, and user management.',
  ARRAY['Next.js', 'Prisma', 'Stripe', 'Tailwind CSS'],
  'intermediate',
  10,
  'https://github.com/example/saas-starter',
  'https://saas-starter-demo.vercel.app',
  'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  245,
  1250,
  '00000000-0000-0000-0000-000000000000',
  ARRAY['Authentication', 'Payments', 'User Management', 'Dashboard'],
  ARRAY['Node.js 18+', 'PostgreSQL', 'Stripe Account'],
  'npm install && npm run setup',
  'Configure environment variables in .env.local',
  'Full Stack',
  'Next.js',
  'MIT',
  '2.1.0'
),
(
  'AI Chat Application',
  'A ready-to-deploy AI chat application with streaming responses and message history.',
  ARRAY['React', 'OpenAI API', 'Firebase', 'Tailwind CSS'],
  'beginner',
  5,
  'https://github.com/example/ai-chat',
  'https://ai-chat-demo.vercel.app',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  189,
  890,
  '00000000-0000-0000-0000-000000000000',
  ARRAY['Real-time Chat', 'AI Integration', 'Message History', 'Responsive Design'],
  ARRAY['React 18+', 'OpenAI API Key', 'Firebase Project'],
  'npm install && npm run dev',
  'Add your OpenAI API key to .env',
  'Frontend',
  'React',
  'MIT',
  '1.3.0'
),
(
  'E-commerce Store',
  'A complete e-commerce store with product listings, cart, and checkout.',
  ARRAY['Next.js', 'Stripe', 'Sanity CMS', 'Tailwind CSS'],
  'intermediate',
  15,
  'https://github.com/example/ecommerce',
  'https://ecommerce-demo.vercel.app',
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  312,
  1560,
  '00000000-0000-0000-0000-000000000000',
  ARRAY['Product Catalog', 'Shopping Cart', 'Payment Processing', 'Admin Panel'],
  ARRAY['Node.js 18+', 'Stripe Account', 'Sanity Account'],
  'npm install && npm run setup',
  'Configure Stripe and Sanity credentials',
  'E-commerce',
  'Next.js',
  'MIT',
  '3.0.1'
)
) AS v(title, description, technologies, complexity, setup_time, repository_url, preview_url, image_url, stars, downloads, author_id, features, requirements, installation, configuration, category, framework, license, version)
WHERE NOT EXISTS (
  SELECT 1 FROM templates 
  WHERE title = v.title AND author_id = '00000000-0000-0000-0000-000000000000'
);