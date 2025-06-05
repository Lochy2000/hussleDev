/*
  # Update Database Content
  
  1. Changes
    - Add new templates and hustles using existing RLS policies
    - Update existing content with more metadata
    - Add sample data for testing
  
  2. Security
    - Uses existing RLS policies
    - Maintains data integrity
*/

-- Add more templates with rich metadata
INSERT INTO templates (
  title, description, technologies, complexity, setup_time,
  repository_url, preview_url, image_url, author_id,
  features, requirements, installation, configuration,
  category, framework, license, version
) VALUES
  (
    'E-commerce Platform',
    'Complete e-commerce solution with product management, cart, checkout, and admin dashboard.',
    ARRAY['React', 'Node.js', 'Stripe', 'PostgreSQL'],
    'intermediate',
    20,
    'https://github.com/example/ecommerce-platform',
    'https://ecommerce.demo.com',
    'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
    '00000000-0000-0000-0000-000000000000',
    ARRAY['Product Management', 'Shopping Cart', 'Stripe Checkout', 'Admin Dashboard'],
    ARRAY['Node.js 18+', 'PostgreSQL', 'Stripe Account'],
    'Step-by-step setup guide with database initialization',
    'Detailed configuration for payment and shipping',
    'E-commerce',
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
    '00000000-0000-0000-0000-000000000000',
    ARRAY['Blog', 'Project Showcase', 'Analytics', 'SEO'],
    ARRAY['Node.js 16+'],
    'Quick start with content customization guide',
    'Theme and content configuration options',
    'Portfolio',
    'Next.js',
    'MIT',
    '1.0.0'
  );

-- Add more diverse hustles
INSERT INTO hustles (
  title, description, tags, status, user_id,
  time_commitment, earning_potential, image, tools,
  category
) VALUES
  (
    'API Monitoring Dashboard',
    'Build a real-time API monitoring service with alerts and performance tracking.',
    ARRAY['saas', 'monitoring', 'devops'],
    'saved',
    '00000000-0000-0000-0000-000000000000',
    'medium',
    'high',
    'https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg',
    ARRAY['Node.js', 'React', 'WebSocket', 'TimescaleDB'],
    'Developer Tools'
  ),
  (
    'Technical Blog Platform',
    'Create a specialized blogging platform for developers with code snippets and interactive demos.',
    ARRAY['content', 'blogging', 'developer-tools'],
    'saved',
    '00000000-0000-0000-0000-000000000000',
    'high',
    'medium',
    'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg',
    ARRAY['React', 'MDX', 'PostgreSQL'],
    'Content Platform'
  );