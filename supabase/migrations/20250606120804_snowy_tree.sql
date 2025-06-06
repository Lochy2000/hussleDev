-- Insert sample hustles for explore page (these will be visible to all users except their creators)
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
) VALUES 
(
  'Code Deployment Assistant',
  'Build a tool that helps developers automate their deployment processes with best practices.',
  ARRAY['devops', 'automation', 'tools'],
  'launched',
  '00000000-0000-0000-0000-000000000000', -- System user ID
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
);