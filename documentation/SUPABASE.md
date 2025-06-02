# Supabase Implementation Documentation

## Database Schema

### Tables

#### hustles
```sql
CREATE TABLE hustles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('saved', 'in-progress', 'launched')),
  user_id UUID NOT NULL,
  notes TEXT,
  time_commitment TEXT NOT NULL CHECK (time_commitment IN ('low', 'medium', 'high')),
  earning_potential TEXT NOT NULL,
  image TEXT NOT NULL,
  tools TEXT[] NOT NULL DEFAULT '{}'
);
```

#### profiles
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  twitter_username TEXT,
  github_username TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}'
);
```

## Security

### Row Level Security (RLS)
- Enabled on all tables
- Users can only access their own data
- Public profiles viewable by everyone

### Policies

#### hustles
```sql
-- Select
CREATE POLICY "Users can view their own hustles"
ON hustles FOR SELECT USING (auth.uid() = user_id);

-- Insert
CREATE POLICY "Users can insert their own hustles"
ON hustles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update
CREATE POLICY "Users can update their own hustles"
ON hustles FOR UPDATE USING (auth.uid() = user_id);

-- Delete
CREATE POLICY "Users can delete their own hustles"
ON hustles FOR DELETE USING (auth.uid() = user_id);
```

#### profiles
```sql
-- Select
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

-- Insert
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Update
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);
```

## Storage

### Buckets
- avatars: For user profile pictures
- hustles: For hustle-related images

### Security Rules
```sql
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Real-time
- Enabled for hustles table
- Subscriptions for:
  - New hustles
  - Status updates
  - Note changes

## Authentication
- Email/password
- GitHub OAuth
- Email verification
- Password reset

## API Integration
```typescript
// Client setup
const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Real-time subscription
const channel = supabase
  .channel('hustles')
  .on('postgres_changes', { 
    event: '*',
    schema: 'public',
    table: 'hustles'
  }, payload => {
    // Handle changes
  })
  .subscribe();
```

## Error Handling
- Custom error types
- Toast notifications
- Form validation
- API error handling

## Rate Limiting
Coming soon:
- Request rate limiting
- API usage quotas
- DDoS protection