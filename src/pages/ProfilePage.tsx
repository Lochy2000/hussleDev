import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Save, Loader } from 'lucide-react';
import ImageUpload from '../components/ui/ImageUpload';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { getProfile, updateProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, getProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setSaving(true);
      await updateProfile(currentUser.id, profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setProfile(prev => ({ ...prev, avatar_url: url }));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setProfile(prev => ({ ...prev, skills }));
  };

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(interest => interest.trim()).filter(Boolean);
    setProfile(prev => ({ ...prev, interests }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-10 h-10 border-4 border-hustle-400 border-t-transparent rounded-full animate-spin"></div>
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
        <h1 className="text-3xl font-mono font-bold mb-2">Profile Settings</h1>
        <p className="text-dark-300 mb-8">Manage your profile information and preferences</p>

        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <ImageUpload
                currentImageUrl={profile.avatar_url}
                onUpload={handleImageUpload}
                folder="avatars"
              />
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
                  placeholder="johndoe"
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
                  placeholder="John Doe"
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
                placeholder="Tell us about yourself..."
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
                  placeholder="https://yourwebsite.com"
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
                  placeholder="username"
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
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={profile.interests.join(', ')}
                  onChange={(e) => handleInterestsChange(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                  placeholder="Web Development, AI, DevOps"
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