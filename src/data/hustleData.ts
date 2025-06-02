export type HustleTag = 
  | 'fullstack' 
  | 'frontend' 
  | 'backend' 
  | 'mobile' 
  | 'ai' 
  | 'saas' 
  | 'tool' 
  | 'extension' 
  | 'web3' 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced';

export type TimeCommitment = 'low' | 'medium' | 'high';
export type EarningPotential = 'low' | 'medium' | 'high';

export interface Hustle {
  id: string;
  title: string;
  description: string;
  tags: HustleTag[];
  timeCommitment: TimeCommitment;
  earningPotential: EarningPotential;
  image: string;
  tools: string[];
}

export const hustleData: Hustle[] = [
  {
    id: '1',
    title: 'AI Code Reviewer Chrome Extension',
    description: 'Build a Chrome extension that uses AI to review code in GitHub PRs, suggesting improvements and catching bugs.',
    tags: ['frontend', 'ai', 'extension', 'intermediate'],
    timeCommitment: 'medium',
    earningPotential: 'medium',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['JavaScript', 'Chrome Extension API', 'OpenAI API'],
  },
  {
    id: '2',
    title: 'Developer Productivity Dashboard',
    description: 'Create a dashboard that integrates with GitHub, JIRA, and Slack to show developer productivity metrics and suggest improvements.',
    tags: ['fullstack', 'saas', 'tool', 'intermediate'],
    timeCommitment: 'high',
    earningPotential: 'high',
    image: 'https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['React', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    id: '3',
    title: 'Code Snippet Library',
    description: 'Build a searchable library of code snippets with syntax highlighting, tags, and the ability to share snippets with others.',
    tags: ['frontend', 'tool', 'beginner'],
    timeCommitment: 'low',
    earningPotential: 'low',
    image: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['Vue.js', 'Firebase'],
  },
  {
    id: '4',
    title: 'API Monitoring Service',
    description: 'Create a service that monitors API endpoints for uptime, response time, and errors, and sends alerts when issues are detected.',
    tags: ['backend', 'saas', 'intermediate'],
    timeCommitment: 'medium',
    earningPotential: 'high',
    image: 'https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['Node.js', 'Express', 'MongoDB', 'Redis'],
  },
  {
    id: '5',
    title: 'Markdown Note-Taking App',
    description: 'Build a note-taking app that supports Markdown, code snippets, and real-time collaboration with other users.',
    tags: ['fullstack', 'saas', 'intermediate'],
    timeCommitment: 'medium',
    earningPotential: 'medium',
    image: 'https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
  },
  {
    id: '6',
    title: 'No-Code Website Builder',
    description: 'Create a drag-and-drop website builder that generates clean, responsive HTML/CSS code.',
    tags: ['fullstack', 'saas', 'advanced'],
    timeCommitment: 'high',
    earningPotential: 'high',
    image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['React', 'Node.js', 'Express', 'PostgreSQL'],
  },
  {
    id: '7',
    title: 'Freelancer Time Tracker',
    description: 'Build a time tracking app specifically for freelance developers, with invoicing, client management, and project tracking.',
    tags: ['fullstack', 'saas', 'intermediate'],
    timeCommitment: 'medium',
    earningPotential: 'medium',
    image: 'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['React', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    id: '8',
    title: 'Tech Interview Prep Platform',
    description: 'Create a platform for developers to practice technical interviews with coding challenges, mock interviews, and feedback.',
    tags: ['fullstack', 'saas', 'advanced'],
    timeCommitment: 'high',
    earningPotential: 'high',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
  },
  {
    id: '9',
    title: 'Coding Challenge Platform',
    description: 'Build a platform for developers to solve coding challenges and compete with others in timed contests.',
    tags: ['fullstack', 'saas', 'advanced'],
    timeCommitment: 'high',
    earningPotential: 'medium',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker'],
  },
  {
    id: '10',
    title: 'Developer Portfolio Generator',
    description: 'Create a tool that generates a beautiful developer portfolio website from GitHub profile and projects.',
    tags: ['frontend', 'tool', 'beginner'],
    timeCommitment: 'low',
    earningPotential: 'low',
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['React', 'GitHub API'],
  },
  {
    id: '11',
    title: 'Code Documentation Generator',
    description: 'Build a tool that automatically generates documentation from code comments in various programming languages.',
    tags: ['backend', 'tool', 'intermediate'],
    timeCommitment: 'medium',
    earningPotential: 'medium',
    image: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['Node.js', 'Express'],
  },
  {
    id: '12',
    title: 'AI-Powered Code Completion Tool',
    description: 'Create a VS Code extension that uses AI to provide smart code completion and suggestions.',
    tags: ['frontend', 'ai', 'extension', 'advanced'],
    timeCommitment: 'high',
    earningPotential: 'high',
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tools: ['TypeScript', 'VS Code Extension API', 'OpenAI API'],
  },
];

export const templateData = [
  {
    id: '1',
    title: 'SaaS Starter Kit',
    description: 'A complete SaaS starter kit with authentication, payments, and user management.',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    technologies: ['Next.js', 'Prisma', 'Stripe', 'Tailwind CSS'],
    complexity: 'Medium',
    setupTime: '10 minutes',
  },
  {
    id: '2',
    title: 'AI Chat Application',
    description: 'A ready-to-deploy AI chat application with streaming responses and message history.',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    technologies: ['React', 'OpenAI API', 'Firebase', 'Tailwind CSS'],
    complexity: 'Low',
    setupTime: '5 minutes',
  },
  {
    id: '3',
    title: 'E-commerce Store',
    description: 'A complete e-commerce store with product listings, cart, and checkout.',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    technologies: ['Next.js', 'Stripe', 'Sanity CMS', 'Tailwind CSS'],
    complexity: 'Medium',
    setupTime: '15 minutes',
  },
  {
    id: '4',
    title: 'Developer Blog',
    description: 'A modern developer blog with Markdown support and syntax highlighting.',
    image: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    technologies: ['Astro', 'Tailwind CSS', 'MDX'],
    complexity: 'Low',
    setupTime: '5 minutes',
  },
  {
    id: '5',
    title: 'API Backend',
    description: 'A ready-to-deploy API backend with authentication and database integration.',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    complexity: 'Medium',
    setupTime: '10 minutes',
  },
  {
    id: '6',
    title: 'Landing Page',
    description: 'A beautiful landing page template with animations and responsive design.',
    image: 'https://images.pexels.com/photos/196646/pexels-photo-196646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    technologies: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    complexity: 'Low',
    setupTime: '5 minutes',
  },
];