-- Add base content for templates
INSERT INTO templates (
  title, description, technologies, complexity, setup_time,
  repository_url, preview_url, image_url, author_id,
  features, requirements, installation, configuration,
  category, framework, license, version
) VALUES
  (
    'SaaS Starter Kit',
    'A complete SaaS boilerplate with authentication, payments, and user management. Includes Stripe integration, email templates, and dashboard.',
    ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Stripe'],
    'intermediate',
    15,
    'https://github.com/example/saas-starter',
    'https://saas-starter.demo.com',
    'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    auth.uid(),
    ARRAY['Authentication', 'Payments', 'User Management', 'Email Templates', 'Dashboard'],
    ARRAY['Node.js 18+', 'npm or yarn', 'Supabase account', 'Stripe account'],
    'Clone the repository and run npm install to get started.',
    'Set up your environment variables and configure your API keys.',
    'Full Stack',
    'Next.js',
    'MIT',
    '1.0.0'
  ),
  (
    'AI Chat Platform',
    'Production-ready AI chat application with streaming responses, conversation history, and prompt management.',
    ARRAY['React', 'TypeScript', 'Tailwind CSS', 'OpenAI'],
    'beginner',
    10,
    'https://github.com/example/ai-chat',
    'https://ai-chat.demo.com',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    auth.uid(),
    ARRAY['Streaming Responses', 'Conversation History', 'Prompt Management', 'Token Usage Tracking'],
    ARRAY['Node.js 18+', 'OpenAI API key'],
    'Clone the repository and install dependencies using npm install.',
    'Configure your OpenAI API key and customize the chat settings.',
    'AI/ML',
    'Next.js',
    'MIT',
    '1.0.0'
  ),
  (
    'Developer Portfolio',
    'Modern portfolio template with blog, project showcase, and analytics.',
    ARRAY['React', 'MDX', 'Tailwind CSS'],
    'beginner',
    5,
    'https://github.com/example/dev-portfolio',
    'https://portfolio.demo.com',
    'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
    auth.uid(),
    ARRAY['Blog', 'Project Showcase', 'Analytics', 'SEO'],
    ARRAY['Node.js 16+'],
    'Clone the repository and customize your content.',
    'Update the configuration with your personal information.',
    'Portfolio',
    'Next.js',
    'MIT',
    '1.0.0'
  );

-- Add base content for hustles
INSERT INTO hustles (
  title, description, tags, status, user_id,
  time_commitment, earning_potential, image, tools,
  category
) VALUES
  (
    'AI Code Review Assistant',
    'Build a VS Code extension that uses AI to review code and suggest improvements. Integrate with OpenAI''s GPT-4 for intelligent code analysis.',
    ARRAY['ai', 'developer-tools', 'vscode'],
    'saved',
    auth.uid(),
    'medium',
    'high',
    'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    ARRAY['TypeScript', 'VS Code API', 'OpenAI API'],
    'Developer Tools'
  ),
  (
    'Freelance Project Manager',
    'Create a specialized project management tool for freelance developers with time tracking, invoicing, and client management.',
    ARRAY['saas', 'productivity', 'freelance'],
    'saved',
    auth.uid(),
    'high',
    'high',
    'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg',
    ARRAY['React', 'Node.js', 'PostgreSQL'],
    'SaaS'
  ),
  (
    'API Monitoring Dashboard',
    'Build a real-time API monitoring service with alerts and performance tracking.',
    ARRAY['saas', 'monitoring', 'devops'],
    'saved',
    auth.uid(),
    'medium',
    'high',
    'https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg',
    ARRAY['Node.js', 'React', 'WebSocket', 'TimescaleDB'],
    'Developer Tools'
  );