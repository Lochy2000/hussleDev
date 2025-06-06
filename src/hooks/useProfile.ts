import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export function useProfile() {
  const getProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results

      if (error) throw error;
      
      // If no profile exists, create one
      if (!data) {
        console.log('No profile found, creating one...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: null,
            full_name: null,
            avatar_url: null,
            website: null,
            bio: null,
            twitter_username: null,
            github_username: null,
            skills: [],
            interests: []
          })
          .select()
          .single();

        if (createError) throw createError;
        return newProfile;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      // Don't show toast error for profile issues, just log it
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: ProfileUpdate) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  }, []);

  const uploadAvatar = useCallback(async (userId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await updateProfile(userId, { avatar_url: publicUrl });

      toast.success('Avatar uploaded successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      throw error;
    }
  }, [updateProfile]);

  return {
    getProfile,
    updateProfile,
    uploadAvatar,
  };
}