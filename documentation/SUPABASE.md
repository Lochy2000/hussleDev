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
  tools TEXT[] NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  collaborators UUID[] DEFAULT '{}',
  progress INTEGER CHECK (progress BETWEEN 0 AND 100),
  revenue_target DECIMAL,
  current_revenue DECIMAL DEFAULT 0,
  category TEXT,
  launch_date TIMESTAMPTZ,
  last_milestone TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMPTZ,
  milestones JSONB DEFAULT '[]',
  github_url TEXT,
  website_url TEXT
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

#### hustle_comments
```sql
CREATE TABLE hustle_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES hustle_comments(id) ON DELETE CASCADE
);
```

#### hustle_likes
```sql
CREATE TABLE hustle_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  UNIQUE(hustle_id, user_id)
);
```

#### hustle_resources
```sql
CREATE TABLE hustle_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('link', 'document', 'video', 'repository')),
  description TEXT
);
```

#### templates
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  complexity TEXT NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced')),
  setup_time INTEGER NOT NULL,
  repository_url TEXT NOT NULL,
  preview_url TEXT,
  image_url TEXT NOT NULL
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
CREATE POLICY "Users can create their own hustles"
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
  - Comments
  - Likes

## Authentication
- Email/password
- GitHub OAuth
- Email verification
- Password reset

## Error Handling
- Custom error types
- Toast notifications
- Form validation
- API error handling
- Error boundaries

## Rate Limiting
- Request rate limiting
- API usage quotas
- DDoS protection

## Performance
- Optimized queries
- Proper indexing
- Connection pooling
- Cache management