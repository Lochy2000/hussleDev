-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own hustles" ON hustles;
DROP POLICY IF EXISTS "Users can insert their own hustles" ON hustles;
DROP POLICY IF EXISTS "Users can update their own hustles" ON hustles;
DROP POLICY IF EXISTS "Users can delete their own hustles" ON hustles;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

-- Create hustles table
CREATE TABLE IF NOT EXISTS hustles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}' NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('saved', 'in-progress', 'launched')),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    notes TEXT,
    time_commitment TEXT NOT NULL CHECK (time_commitment IN ('low', 'medium', 'high')),
    earning_potential TEXT NOT NULL CHECK (earning_potential IN ('low', 'medium', 'high')),
    image TEXT NOT NULL,
    tools TEXT[] DEFAULT '{}' NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS hustles_user_id_idx ON hustles(user_id);
CREATE INDEX IF NOT EXISTS hustles_status_idx ON hustles(status);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);

-- Set up RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hustles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO public
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO public
USING (auth.uid() = id);

-- Hustles policies
CREATE POLICY "Users can view their own hustles"
ON hustles FOR SELECT
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hustles"
ON hustles FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hustles"
ON hustles FOR UPDATE
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hustles"
ON hustles FOR DELETE
TO public
USING (auth.uid() = user_id);

-- Create triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hustles_updated_at ON hustles;
CREATE TRIGGER update_hustles_updated_at
    BEFORE UPDATE ON hustles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();