import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, DollarSign, Code, Link, BookmarkCheck, Bookmark, ExternalLink } from 'lucide-react';
import { useHustleManagement } from '../../hooks/useHustleManagement';
import { Database } from '../../lib/database.types';

type Hustle = Database['public']['Tables']['hustles']['Row'];

interface HustleModalProps {
  hustle: Hustle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

const HustleModal: React.FC<HustleModalProps> = ({ 
  hustle, 
  isOpen, 
  onClose, 
  onSave,
  isSaved 
}) => {
  if (!hustle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-dark-800 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-dark-300 hover:text-white rounded-full hover:bg-dark-700 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative h-48 md:h-64">
              <img
                src={hustle.image}
                alt={hustle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-mono font-bold mb-2">{hustle.title}</h2>
                {onSave && (
                  <button
                    onClick={() => onSave(hustle.id)}
                    className="p-2 text-dark-300 hover:text-white rounded-full hover:bg-dark-700 transition-colors"
                  >
                    {isSaved ? (
                      <BookmarkCheck size={20} className="text-hustle-300" />
                    ) : (
                      <Bookmark size={20} />
                    )}
                  </button>
                )}
              </div>

              <p className="text-dark-200 mb-6">{hustle.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-dark-300">
                  <Clock size={16} className="mr-2" />
                  <span className="capitalize">{hustle.time_commitment}</span> time
                </div>
                <div className="flex items-center text-dark-300">
                  <DollarSign size={16} className="mr-2" />
                  <span className="capitalize">{hustle.earning_potential}</span> earnings
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hustle.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 bg-dark-700 text-dark-200 rounded-full text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hustle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-hustle-700/50 text-hustle-200 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {hustle.status === 'launched' && hustle.launch_date && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                    Launch Details
                  </h3>
                  <div className="bg-dark-700 rounded-lg p-4">
                    <p className="text-dark-200">
                      Launched on {new Date(hustle.launch_date).toLocaleDateString()}
                    </p>
                    {hustle.current_revenue !== null && (
                      <p className="text-dark-200 mt-2">
                        Revenue: ${hustle.current_revenue}
                        {hustle.revenue_target && (
                          <span className="text-dark-400">
                            {' '}/ ${hustle.revenue_target} target
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                {onSave && (
                  <button
                    onClick={() => onSave(hustle.id)}
                    className="btn btn-primary neon-glow neon-purple"
                  >
                    {isSaved ? 'Saved' : 'Save Hustle'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HustleModal;