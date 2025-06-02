# Hustle.dev Features Documentation

## Core Features

### Authentication
- Email/password authentication
- GitHub OAuth integration
- Protected routes
- Session management
- Form validation using Zod
- Toast notifications for success/error states

### User Management
- User profiles with avatars
- Profile customization
  - Basic info (name, username)
  - Bio and website
  - Social links (Twitter, GitHub)
  - Skills and interests
- Avatar upload with Supabase Storage

### Hustle Management
- Create, read, update, delete (CRUD) operations
- Real-time updates using Supabase subscriptions
- Status tracking (saved, in-progress, launched)
- Notes and progress tracking
- Tags and categorization
- Time commitment and earning potential indicators

### Dashboard
- Kanban-style board layout
- Drag-and-drop organization (coming soon)
- Progress tracking
- Quick actions (start, launch, notes)
- Real-time updates

### Explore Page
- Curated list of side hustle ideas
- Advanced filtering
  - By tags
  - By time commitment
  - By earning potential
- Search functionality
- Save to dashboard feature

### HustleBot
- AI-powered project suggestions
- Context-aware responses
- Example prompts
- Copy-to-clipboard functionality
- Markdown support

### Templates Hub
- Ready-to-use project templates
- Technology stack filtering
- Complexity indicators
- Setup time estimates
- Quick start functionality

## Technical Features

### Real-time Updates
- WebSocket connections for live data
- Automatic UI updates
- Optimistic updates for better UX
- Fallback to polling when needed

### Form Validation
- Zod schema validation
- Real-time validation
- Custom error messages
- Type inference

### Error Handling
- Toast notifications
- Graceful error recovery
- Detailed error messages
- Error boundary implementation

### Security
- Row Level Security (RLS)
- Protected API routes
- Input sanitization
- Rate limiting (coming soon)

### Performance
- Code splitting
- Lazy loading
- Optimized images
- Caching strategies

## Usage Examples

### Authentication
```typescript
// Login with email
await login(email, password);

// Login with GitHub
await loginWithGithub();
```

### Profile Management
```typescript
// Update profile
await updateProfile(userId, {
  username: 'johndoe',
  full_name: 'John Doe',
  bio: 'Full-stack developer'
});

// Upload avatar
await uploadAvatar(file);
```

### Hustle Management
```typescript
// Create hustle
await createHustle({
  title: 'My Project',
  description: 'Project description',
  status: 'saved'
});

// Update status
await updateHustle(id, { status: 'in-progress' });
```

### Real-time Updates
```typescript
// Subscribe to changes
const channel = supabase
  .channel('hustles')
  .on('INSERT', handleNewHustle)
  .on('UPDATE', handleHustleUpdate)
  .subscribe();
```

## Image Optimization

### Features
- Automatic image optimization
- WebP conversion
- Dimension constraints
- Quality compression
- Secure upload validation
- CDN delivery

### Implementation
- Client-side optimization
- Server-side validation
- Supabase Storage integration
- Automatic WebP conversion
- Responsive image sizes

### Usage Example
```typescript
// Upload and optimize an image
const imageUrl = await uploadImage(file, 'hustles', 'my-image.webp');

// Validate an image
const validation = await validateImage(file);
if (!validation.valid) {
  console.error(validation.error);
}

// Delete an image
await deleteImage('hustles/my-image.webp');
```

### Image Sizes
- Thumbnail: 200x200
- Medium: 600x600
- Large: 1200x1200

### Supported Formats
- JPEG
- PNG
- WebP

### Security
- File type validation
- Size limits (5MB max)
- Secure URL generation
- Access control