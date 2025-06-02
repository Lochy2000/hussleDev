import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Camera, Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { getProfile, updateProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    avatar_url: '',
    website: '',
    bio: '',
    twitter_username: '',
    github_username: '',
    skills: [] as string[],
    interests: [] as string[]
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!currentUser) return;
        const data = await getProfile(currentUser.id);
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, getProfile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      const file = event.target.files?.[0];
      if (!file || !currentUser) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${currentUser.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile(currentUser.id, {
        avatar_url: publicUrl
      });

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error(error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setSaving(true);
      await updateProfile(currentUser.id, profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-hustle-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-mono font-bold mb-8">Profile Settings</h1>

        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-dark-600"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-hustle-500 p-2 rounded-full cursor-pointer hover:bg-hustle-400 transition-colors"
                >
                  <Camera size={16} className="text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </div>
              <div>
                <h2 className="text-lg font-medium">{profile.full_name || 'Your Name'}</h2>
                <p className="text-dark-300">@{profile.username || 'username'}</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">
                Bio
              </label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Twitter Username
                </label>
                <input
                  type="text"
                  value={profile.twitter_username || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, twitter_username: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Skills and Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={profile.skills.join(', ')}
                  onChange={(e) => setProfile(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={profile.interests.join(', ')}
                  onChange={(e) => setProfile(prev => ({ ...prev, interests: e.target.value.split(',').map(s => s.trim()) }))}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary neon-glow neon-purple flex items-center"
              >
                {saving ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;