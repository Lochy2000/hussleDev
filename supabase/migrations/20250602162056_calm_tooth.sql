/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `website` (text)
      - `bio` (text)
      - `twitter_username` (text)
      - `github_username` (text)
      - `skills` (text array)
      - `interests` (text array)

  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Public read access to all profiles
      - Users can insert their own profile
      - Users can update their own profile
*/

-- Create profiles table
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create updated_at trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for username lookups
CREATE INDEX profiles_username_idx ON profiles(username);