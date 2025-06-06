import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, DollarSign, Code, BookmarkCheck, Bookmark, ExternalLink, Calendar, Target } from 'lucide-react';
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
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl bg-dark-800 rounded-lg shadow-xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-dark-300 hover:text-white rounded-full hover:bg-dark-700 transition-colors z-10"
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
              
              {/* Save button */}
              {onSave && (
                <button
                  onClick={() => onSave(hustle.id)}
                  className="absolute bottom-4 right-4 p-3 bg-dark-900/70 backdrop-blur-sm rounded-full text-white hover:bg-dark-800 transition-colors"
                >
                  {isSaved ? (
                    <BookmarkCheck size={20} className="text-hustle-300" />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-mono font-bold mb-3">{hustle.title}</h2>
                <p className="text-dark-200 text-lg leading-relaxed">{hustle.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-dark-700 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center text-dark-300 mb-1">
                    <Clock size={16} className="mr-1" />
                  </div>
                  <p className="text-sm text-dark-400">Time</p>
                  <p className="font-medium capitalize">{hustle.time_commitment}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-dark-300 mb-1">
                    <DollarSign size={16} className="mr-1" />
                  </div>
                  <p className="text-sm text-dark-400">Earnings</p>
                  <p className="font-medium capitalize">{hustle.earning_potential}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-dark-300 mb-1">
                    <Target size={16} className="mr-1" />
                  </div>
                  <p className="text-sm text-dark-400">Status</p>
                  <p className="font-medium capitalize">{hustle.status.replace('-', ' ')}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-dark-300 mb-1">
                    <Code size={16} className="mr-1" />
                  </div>
                  <p className="text-sm text-dark-400">Version</p>
                  <p className="font-medium">v{hustle.version}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-dark-200 mb-3 flex items-center">
                  <Code size={18} className="mr-2" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hustle.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 bg-dark-700 text-dark-200 rounded-full text-sm border border-dark-600"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-dark-200 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {hustle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-hustle-700/50 text-hustle-200 rounded-full text-sm border border-hustle-600/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & Revenue (if applicable) */}
              {(hustle.progress !== null || hustle.current_revenue !== null || hustle.revenue_target !== null) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-dark-200 mb-3">Progress & Revenue</h3>
                  <div className="bg-dark-700 rounded-lg p-4 space-y-3">
                    {hustle.progress !== null && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-dark-300">Progress</span>
                          <span className="text-white">{hustle.progress}%</span>
                        </div>
                        <div className="w-full bg-dark-600 rounded-full h-2">
                          <div 
                            className="bg-hustle-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${hustle.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {(hustle.current_revenue !== null || hustle.revenue_target !== null) && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {hustle.current_revenue !== null && (
                          <div>
                            <p className="text-dark-400">Current Revenue</p>
                            <p className="text-lg font-medium text-green-400">${hustle.current_revenue}</p>
                          </div>
                        )}
                        {hustle.revenue_target !== null && (
                          <div>
                            <p className="text-dark-400">Revenue Target</p>
                            <p className="text-lg font-medium text-white">${hustle.revenue_target}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Launch Details */}
              {hustle.status === 'launched' && hustle.launch_date && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-dark-200 mb-3 flex items-center">
                    <Calendar size={18} className="mr-2" />
                    Launch Details
                  </h3>
                  <div className="bg-dark-700 rounded-lg p-4">
                    <p className="text-dark-200">
                      Launched on {new Date(hustle.launch_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {hustle.last_milestone && (
                      <p className="text-dark-300 mt-2">
                        Latest milestone: {hustle.last_milestone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Links */}
              {(hustle.github_url || hustle.website_url) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-dark-200 mb-3">Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {hustle.github_url && (
                      <a
                        href={hustle.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-200 hover:text-white rounded-md transition-colors"
                      >
                        <Code size={16} className="mr-2" />
                        Repository
                        <ExternalLink size={14} className="ml-2" />
                      </a>
                    )}
                    {hustle.website_url && (
                      <a
                        href={hustle.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-200 hover:text-white rounded-md transition-colors"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Website
                        <ExternalLink size={14} className="ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {hustle.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-dark-200 mb-3">Notes</h3>
                  <div className="bg-dark-700 rounded-lg p-4">
                    <p className="text-dark-200 whitespace-pre-wrap">{hustle.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-dark-700">
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