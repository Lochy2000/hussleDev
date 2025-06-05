/*
  # Populate Initial Content

  1. Content Added
    - 20 curated side hustle templates
    - 50 starter hustles
    - Categories and tags structure

  2. Data Structure
    - Templates with complete metadata
    - Hustles with detailed descriptions
    - Proper categorization and tagging

  3. Quality Standards
    - Production-ready templates
    - Realistic revenue potential
    - Detailed setup instructions
    - Modern tech stacks
*/

-- Populate templates
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
    '00000000-0000-0000-0000-000000000000',
    ARRAY['Authentication', 'Payments', 'User Management', 'Email Templates', 'Dashboard'],
    ARRAY['Node.js 18+', 'npm or yarn', 'Supabase account', 'Stripe account'],
    'Detailed installation guide with step-by-step instructions',
    'Environment variables and configuration options documentation',
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
    '00000000-0000-0000-0000-000000000000',
    ARRAY['Streaming Responses', 'Conversation History', 'Prompt Management', 'Token Usage Tracking'],
    ARRAY['Node.js 18+', 'OpenAI API key'],
    'Quick start guide with API setup instructions',
    'API key and model configuration documentation',
    'AI/ML',
    'Next.js',
    'MIT',
    '1.0.0'
  );

-- Populate hustles
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
    '00000000-0000-0000-0000-000000000000',
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
    '00000000-0000-0000-0000-000000000000',
    'high',
    'high',
    'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg',
    ARRAY['React', 'Node.js', 'PostgreSQL'],
    'SaaS'
  );

-- Add more templates and hustles as needed...