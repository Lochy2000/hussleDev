import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader, Plus } from 'lucide-react';
import { useHustleManagement } from '../../hooks/useHustleManagement';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface CreateHustleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateHustleModal: React.FC<CreateHustleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { currentUser } = useAuth();
  const { createHustle, loading } = useHustleManagement();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    time_commitment: 'medium' as 'low' | 'medium' | 'high',
    earning_potential: 'medium' as 'low' | 'medium' | 'high',
    image: '',
    tools: '',
    category: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to create a hustle');
      return;
    }

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const toolsArray = formData.tools.split(',').map(tool => tool.trim()).filter(Boolean);

      await createHustle({
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        time_commitment: formData.time_commitment,
        earning_potential: formData.earning_potential,
        image: formData.image || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        tools: toolsArray,
        category: formData.category || null,
        notes: formData.notes || null
      });

      toast.success('Hustle created successfully!');
      onClose();
      onSuccess?.();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        tags: '',
        time_commitment: 'medium',
        earning_potential: 'medium',
        image: '',
        tools: '',
        category: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating hustle:', error);
      toast.error('Failed to create hustle');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-dark-800 rounded-lg shadow-xl border border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <h2 className="text-xl font-mono font-bold">Create New Hustle</h2>
            <button
              onClick={onClose}
              className="p-2 text-dark-300 hover:text-white rounded-full hover:bg-dark-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="Enter your hustle idea title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="Describe your hustle idea in detail"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Tags (comma-separated) *
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="e.g., frontend, react, saas"
                required
              />
            </div>

            {/* Tools */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Tools/Technologies (comma-separated) *
              </label>
              <input
                type="text"
                value={formData.tools}
                onChange={(e) => handleInputChange('tools', e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="e.g., React, Node.js, MongoDB"
                required
              />
            </div>

            {/* Time Commitment & Earning Potential */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Time Commitment
                </label>
                <select
                  value={formData.time_commitment}
                  onChange={(e) => handleInputChange('time_commitment', e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Earning Potential
                </label>
                <select
                  value={formData.earning_potential}
                  onChange={(e) => handleInputChange('earning_potential', e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Category (optional)
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="e.g., SaaS, Mobile App, API Service"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-dark-400 mt-1">
                Leave empty to use a default image
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Initial Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="Add any initial thoughts or notes about this hustle"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-dark-700">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary neon-glow neon-purple flex items-center"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Create Hustle
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateHustleModal;