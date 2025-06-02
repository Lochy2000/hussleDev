/*
  # Set up avatar storage and policies

  This migration creates:
  1. Storage bucket for avatars
  2. Storage policies for avatar management
*/

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'avatars'
);

-- Create storage policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Avatar public access" ON storage.objects;
  DROP POLICY IF EXISTS "Avatar insert access" ON storage.objects;
  DROP POLICY IF EXISTS "Avatar update access" ON storage.objects;
  DROP POLICY IF EXISTS "Avatar delete access" ON storage.objects;

  -- Create new policies
  CREATE POLICY "Avatar public access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

  CREATE POLICY "Avatar insert access"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'avatars' 
      AND auth.role() = 'authenticated'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );

  CREATE POLICY "Avatar update access"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'avatars' 
      AND auth.role() = 'authenticated'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );

  CREATE POLICY "Avatar delete access"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'avatars' 
      AND auth.role() = 'authenticated'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
END $$;