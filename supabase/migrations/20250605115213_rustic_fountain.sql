-- Add base content for templates and hustles
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
    auth.uid(),
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
    'Technical Blog Platform',
    'Specialized blogging platform for developers with code snippets and interactive demos.',
    ARRAY['React', 'MDX', 'PostgreSQL'],
    'beginner',
    10,
    'https://github.com/example/tech-blog',
    'https://tech-blog.demo.com',
    'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg',
    auth.uid(),
    ARRAY['Code Snippets', 'Interactive Demos', 'SEO', 'Analytics'],
    ARRAY['Node.js 18+', 'PostgreSQL'],
    'Simple setup with content management system',
    'Easy customization of themes and features',
    'Content Platform',
    'Next.js',
    'MIT',
    '1.0.0'
  );

INSERT INTO hustles (
  title, description, tags, status, user_id,
  time_commitment, earning_potential, image, tools,
  category, notes, progress
) VALUES
  (
    'Developer Learning Platform',
    'Create an interactive platform for developers to learn and practice coding with real-time feedback.',
    ARRAY['education', 'coding', 'platform'],
    'in-progress',
    auth.uid(),
    'high',
    'high',
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
    ARRAY['React', 'Node.js', 'MongoDB', 'WebSocket'],
    'Education',
    'Working on the interactive code editor component',
    65
  ),
  (
    'Code Deployment Assistant',
    'Build a tool that helps developers automate their deployment processes with best practices.',
    ARRAY['devops', 'automation', 'tools'],
    'launched',
    auth.uid(),
    'medium',
    'medium',
    'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    ARRAY['Python', 'Docker', 'Kubernetes'],
    'DevOps',
    'Successfully launched beta version',
    100
  );