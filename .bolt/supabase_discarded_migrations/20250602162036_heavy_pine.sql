/*
  # Storage setup for avatar management
  
  1. Creates avatars storage bucket
  2. Sets up storage policies for:
    - Public viewing of avatars
    - Authenticated user upload/update/delete of their own avatars
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
    using_expression text DEFAULT NULL,
    check_expression text DEFAULT NULL,
    policy_roles text DEFAULT 'authenticated'
)
RETURNS void AS $$
BEGIN
    IF operation = 'INSERT' THEN
        EXECUTE format(
            'CREATE POLICY "%s" ON storage.objects FOR %s TO %s WITH CHECK (%s)',
            policy_name,
            operation,
            policy_roles,
            check_expression
        );
    ELSE
        EXECUTE format(
            'CREATE POLICY "%s" ON storage.objects FOR %s TO %s USING (%s)',
            policy_name,
            operation,
            policy_roles,
            using_expression
        );
    END IF;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Set up storage policies
SELECT create_storage_policy(
    'avatars',
    'Public avatar access',
    'SELECT',
    'bucket_id = ''avatars''',
    NULL,
    'authenticated, anon'
);

SELECT create_storage_policy(
    'avatars',
    'Avatar upload',
    'INSERT',
    NULL,
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