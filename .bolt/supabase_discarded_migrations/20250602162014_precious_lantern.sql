/*
  # Storage setup for avatar management
  
  1. Changes
    - Create storage bucket for avatars
    - Set up storage policies for avatar management
  
  2. Security
    - Public read access for avatars
    - Authenticated users can manage their own avatars
*/

-- Create a function to create a bucket if it doesn't exist
CREATE OR REPLACE FUNCTION create_storage_bucket(bucket_name text, is_public boolean)
RETURNS void AS $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES (bucket_name, bucket_name, is_public)
    ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Create avatars bucket
SELECT create_storage_bucket('avatars', true);

-- Create a function to safely create storage policies
CREATE OR REPLACE FUNCTION create_storage_policy(
    bucket_name text,
    policy_name text,
    operation text,
    policy_definition text,
    policy_roles text DEFAULT 'authenticated'
)
RETURNS void AS $$
BEGIN
    BEGIN
        EXECUTE format(
            'CREATE POLICY "%s" ON storage.objects FOR %s TO %s USING (%s)',
            policy_name,
            operation,
            policy_roles,
            policy_definition
        );
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END;
$$ LANGUAGE plpgsql;

-- Set up storage policies
SELECT create_storage_policy(
    'avatars',
    'Public avatar access',
    'SELECT',
    'bucket_id = ''avatars''',
    'authenticated, anon'
);

SELECT create_storage_policy(
    'avatars',
    'Avatar upload',
    'INSERT',
    'bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1]'
);

SELECT create_storage_policy(
    'avatars',
    'Avatar update',
    'UPDATE',
    'bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1]'
);

SELECT create_storage_policy(
    'avatars',
    'Avatar delete',
    'DELETE',
    'bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1]'
);