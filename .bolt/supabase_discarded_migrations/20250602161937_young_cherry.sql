/*
  # Storage policies for avatar management

  1. Changes
    - Create avatars storage bucket
    - Set up storage policies for avatar management
    - Configure public access and user-specific permissions

  2. Security
    - Enable public read access for avatars
    - Restrict write access to authenticated users
    - Ensure users can only manage their own avatars
*/

-- Create storage bucket for avatars if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'avatars'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', true);
    END IF;
END $$;

-- Set up storage policies through Supabase's storage API
SELECT storage.create_policy(
    'avatars',
    'Public can view all avatars',
    'SELECT',
    'authenticated, anon',
    storage.buckets.id = 'avatars'::text
);

SELECT storage.create_policy(
    'avatars',
    'Auth users can upload avatars',
    'INSERT',
    'authenticated',
    storage.buckets.id = 'avatars'::text
    AND (storage.foldername(objects.name))[1] = auth.uid()::text
);

SELECT storage.create_policy(
    'avatars',
    'Auth users can update own avatars',
    'UPDATE',
    'authenticated',
    storage.buckets.id = 'avatars'::text
    AND (storage.foldername(objects.name))[1] = auth.uid()::text
);

SELECT storage.create_policy(
    'avatars',
    'Auth users can delete own avatars',
    'DELETE',
    'authenticated',
    storage.buckets.id = 'avatars'::text
    AND (storage.foldername(objects.name))[1] = auth.uid()::text
);