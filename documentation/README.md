# Hustle.dev Documentation

## Overview
Hustle.dev is a modern web application for discovering, tracking, and implementing developer side hustle ideas. Built with React, TypeScript, and Tailwind CSS, it provides a comprehensive platform for developers to manage their side projects.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Development
Start the development server:
```bash
npm run dev
```

### Building for Production
Build the project:
```bash
npm run build
```

## Architecture

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Zod for form validation
- React Query for data fetching
- React Markdown for content rendering

### Backend
- Supabase for backend services
- Real-time subscriptions
- Row Level Security
- Storage for avatars
- OAuth integration
- Gemini AI integration

### State Management
- React Context for auth state
- Custom hooks for data fetching
- Real-time subscriptions for live updates
- React Query for server state

## Testing
Run tests:
```bash
npm run test
```

## Deployment
The application can be deployed to:
- Netlify
- Vercel
- Any static hosting

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License
MIT License