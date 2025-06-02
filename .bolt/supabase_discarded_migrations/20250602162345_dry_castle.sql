/*
  # Storage and Profile Setup

  1. Storage Configuration
    - Creates avatars bucket if it doesn't exist
    - Sets up proper RLS policies for avatar management
    - Ensures public read access for avatars
  
  2. Profile Enhancements
    - Adds proper indexes and constraints
    - Updates RLS policies
    - Adds trigger for automatic profile creation
*/

-- Create storage bucket for avatars if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Avatar public access" ON storage.objects;
  DROP POLICY IF EXISTS "Avatar insert access" ON storage.objects;
  DROP POLICY IF EXISTS "Avatar update access" ON storage.objects;
  DROP POLICY IF EXISTS "Avatar delete access" ON storage.objects;

  -- Create new policies with proper checks
  CREATE POLICY "Avatar public access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');

  CREATE POLICY "Avatar insert access"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'avatars' 
      AND (storage.foldername(name))[1] = auth.uid()::text
    );

  CREATE POLICY "Avatar update access"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'avatars' 
      AND (storage.foldername(name))[1] = auth.uid()::text
    );

  CREATE POLICY "Avatar delete access"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'avatars' 
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
END $$;

-- Ensure profiles table exists and has proper configuration
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
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

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update profile policies
DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

  -- Create new policies
  CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);
END $$;

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);

-- Create or replace the profile trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();