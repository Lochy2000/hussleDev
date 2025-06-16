 ![hustleDevSmall](https://github.com/user-attachments/assets/be375730-9322-473b-993b-9a3bf5dfd55c) 
# Hustle.dev - Developer Side Hustle Platform 

A modern web application for discovering, tracking, and implementing developer side hustle ideas. Built with React, TypeScript, and Tailwind CSS.


## Current Features

- 🎨 Modern, dark-mode first UI with animated particles and grain effects
- 📱 Fully responsive design optimized for all devices
- 🔍 Explore curated side hustle ideas with filtering
- 📊 Personal dashboard to track hustle progress
- 🤖 AI-powered HustleBot for project suggestions
- 🚀 Templates hub for quick project starts
- 🔐 Mock authentication system

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Framer Motion for animations
- Lucide React for icons
- Headless UI for accessible components

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   └── ui/            # Generic UI components
├── contexts/          # React contexts
├── data/             # Mock data and types
└── pages/            # Page components
```

## Current Placeholders & Next Steps

### Authentication
Currently using mock authentication with localStorage. Next steps:
- Integrate Firebase Authentication
- Add proper user session management
- Implement protected routes with real auth
- Add social login providers

### Database
Currently using localStorage for data persistence. Next steps:
- Set up Firebase/Supabase for data storage
- Create proper data models
- Implement real-time updates
- Add data validation

### API Integration
Currently using static data. Next steps:
- Create API endpoints for:
  - User management
  - Hustle CRUD operations
  - Template management
- Add API key management
- Implement rate limiting
- Add error handling

### HustleBot
Currently using mock responses. Next steps:
- Integrate OpenAI API
- Add conversation history
- Implement proper prompt engineering
- Add response streaming

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with these variables (currently not used, for future implementation):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENAI_API_KEY=
```

## Current User Flow

1. **Authentication**
   - Mock login with any email/password
   - Data persisted in localStorage
   - Simulated loading states

2. **Dashboard**
   - Save hustles to localStorage
   - Organize into Saved/In Progress/Launched
   - Add notes to hustles

3. **Explore**
   - Browse curated list of hustles
   - Filter by tags, complexity, time commitment
   - Save hustles to dashboard

4. **HustleBot**
   - Pattern-matched responses
   - Simulated AI chat interface
   - Example prompts provided

5. **Templates**
   - Browse starter templates
   - Filter by technology
   - Mock template downloads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License
