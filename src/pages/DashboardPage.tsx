import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Trash2, PenSquare, Clock, DollarSign, Code, Plus, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeHustles } from '../hooks/useRealtimeHustles';
import { useSupabase } from '../hooks/useSupabase';
import CreateHustleModal from '../components/ui/CreateHustleModal';
import HustleModal from '../components/ui/HustleModal';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Hustle = Database['public']['Tables']['hustles']['Row'];

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { hustles = [], loading, error, refetch } = useRealtimeHustles(currentUser?.id || '');
  const { updateHustle, deleteHustle } = useSupabase();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHustle, setSelectedHustle] = useState<Hustle | null>(null);
  const [isHustleModalOpen, setIsHustleModalOpen] = useState(false);
  const [lastActionTime, setLastActionTime] = useState<number>(0);

  // Auto-refresh fallback mechanism
  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;
    
    // If an action was performed recently, set up auto-refresh
    if (lastActionTime > 0) {
      refreshTimer = setTimeout(() => {
        console.log('Auto-refreshing dashboard...');
        refetch();
        setLastActionTime(0);
      }, 2000); // Refresh after 2 seconds
    }

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [lastActionTime, refetch]);

  const triggerRefresh = () => {
    setLastActionTime(Date.now());
  };

  const moveHustle = async (hustleId: string, newStatus: 'saved' | 'in-progress' | 'launched') => {
    try {
      await updateHustle(hustleId, { status: newStatus });
      
      // Show success message based on status
      if (newStatus === 'in-progress') {
        toast.success('Hustle moved to In Progress!');
      } else if (newStatus === 'launched') {
        toast.success('🚀 Hustle launched! Congratulations!');
      } else {
        toast.success('Hustle moved to Saved');
      }
      
      // Trigger refresh fallback
      triggerRefresh();
    } catch (error) {
      toast.error('Failed to update hustle status');
    }
  };

  const removeHustle = async (hustleId: string) => {
    if (!confirm('Are you sure you want to delete this hustle?')) return;
    
    try {
      await deleteHustle(hustleId);
      toast.success('Hustle deleted successfully');
      // Trigger refresh fallback
      triggerRefresh();
    } catch (error) {
      toast.error('Failed to delete hustle');
    }
  };

  const startEditingNotes = (hustleId: string, currentNotes: string = '') => {
    setEditingNotes(hustleId);
    setNoteText(currentNotes);
  };

  const saveNotes = async (hustleId: string) => {
    try {
      await updateHustle(hustleId, { notes: noteText });
      setEditingNotes(null);
      toast.success('Notes saved');
      // Trigger refresh fallback
      triggerRefresh();
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const handleHustleClick = (hustle: Hustle) => {
    setSelectedHustle(hustle);
    setIsHustleModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    toast.success('Hustle created and added to your dashboard!');
    // Trigger refresh fallback
    triggerRefresh();
  };

  const handleProgressUpdate = () => {
    // Trigger refresh when tasks are updated
    triggerRefresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-10 h-10 border-4 border-hustle-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto pb-12">
        <div className="text-center py-12">
          <h3 className="text-xl font-mono font-medium mb-2">Failed to load hustles</h3>
          <p className="text-dark-300 mb-6">Please try refreshing the page</p>
          <button onClick={() => refetch()} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Separate hustles by type and status
  const ownHustles = Array.isArray(hustles) ? hustles.filter(h => 
    !h.notes?.includes('Saved from explore page') && 
    !h.notes?.includes('Created by user')
  ) : [];
  
  const userCreatedHustles = Array.isArray(hustles) ? hustles.filter(h => 
    h.notes?.includes('Created by user')
  ) : [];
  
  const savedIdeas = Array.isArray(hustles) ? hustles.filter(h => 
    h.notes?.includes('Saved from explore page')
  ) : [];

  // Combine user created hustles with own hustles for the kanban board
  const allUserHustles = [...ownHustles, ...userCreatedHustles];
  
  const savedHustles = allUserHustles.filter(h => h.status === 'saved');
  const inProgressHustles = allUserHustles.filter(h => h.status === 'in-progress');
  const launchedHustles = allUserHustles.filter(h => h.status === 'launched');

  return (
    <div className="container mx-auto pb-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-mono font-bold mb-2">Your Hustle Room</h1>
            <p className="text-dark-300">Manage and track your side hustle projects</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/explore"
              className="btn btn-secondary flex items-center"
            >
              <Compass size={16} className="mr-2" />
              Explore Ideas
            </Link>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary neon-glow neon-purple flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Create Hustle
            </button>
          </div>
        </div>
      </div>

      {(!Array.isArray(hustles) || hustles.length === 0) ? (
        <div className="text-center py-16 bg-dark-800 rounded-lg border border-dark-700">
          <div className="bg-dark-700 inline-flex rounded-full p-4 mb-4">
            <Compass size={32} className="text-hustle-400" />
          </div>
          <h3 className="text-xl font-mono font-medium mb-3">No hustles yet</h3>
          <p className="text-dark-300 mb-6 max-w-md mx-auto">
            Create your own hustle ideas or explore our curated list to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary neon-glow neon-purple"
            >
              Create Your First Hustle
            </button>
            <Link to="/explore" className="btn btn-secondary">
              Explore Side Hustles
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Saved Ideas Section (Read-only) */}
          {savedIdeas.length > 0 && (
            <div>
              <h2 className="text-xl font-mono font-bold mb-4 flex items-center">
                <Bookmark size={20} className="mr-2 text-hustle-400" />
                Saved Ideas
                <span className="ml-2 bg-dark-700 text-dark-300 text-xs rounded-full px-2 py-0.5">
                  {savedIdeas.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {savedIdeas.map(hustle => (
                  <motion.div
                    key={hustle.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-800 rounded-lg overflow-hidden cursor-pointer border border-hustle-700/30"
                    onClick={() => handleHustleClick(hustle)}
                  >
                    <div className="h-20 overflow-hidden">
                      <img
                        src={hustle.image}
                        alt={hustle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1">{hustle.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {hustle.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-hustle-700/50 text-hustle-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {hustle.tags.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-hustle-700/50 text-hustle-300 rounded-full text-xs">
                            +{hustle.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center border-t border-dark-600 pt-2 mt-2">
                        <span className="text-xs text-dark-400">Inspiration Only</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHustle(hustle.id);
                          }}
                          className="text-dark-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Your Hustles Section */}
          <div>
            <h2 className="text-xl font-mono font-bold mb-4">Your Hustles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Saved Column */}
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-mono font-bold text-lg">Saved</h2>
                  <span className="bg-dark-700 text-dark-300 text-xs rounded-full px-2 py-0.5">
                    {savedHustles.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {savedHustles.length === 0 ? (
                    <div className="text-center p-4 border border-dashed border-dark-600 rounded-lg">
                      <p className="text-dark-400 text-sm">No saved hustles</p>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-hustle-300 hover:text-hustle-200 text-xs mt-1 inline-block"
                      >
                        Create one →
                      </button>
                    </div>
                  ) : (
                    savedHustles.map(hustle => (
                      <motion.div
                        key={hustle.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-700 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleHustleClick(hustle)}
                      >
                        <div className="h-24 overflow-hidden">
                          <img
                            src={hustle.image}
                            alt={hustle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm mb-1">{hustle.title}</h3>
                          
                          {/* Progress bar if available */}
                          {hustle.progress !== null && hustle.progress > 0 && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-dark-400">Progress</span>
                                <span className="text-white">{hustle.progress}%</span>
                              </div>
                              <div className="w-full bg-dark-600 rounded-full h-1">
                                <div 
                                  className="bg-hustle-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${hustle.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {hustle.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 bg-dark-600 text-dark-300 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {hustle.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-dark-600 text-dark-300 rounded-full text-xs">
                                +{hustle.tags.length - 2}
                              </span>
                            )}
                          </div>
                          
                          {editingNotes === hustle.id ? (
                            <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="w-full p-2 bg-dark-800 border border-dark-600 rounded-md text-white text-xs focus:outline-none focus:ring-1 focus:ring-hustle-500"
                                placeholder="Add notes..."
                                rows={3}
                              />
                              <div className="flex justify-end space-x-2 mt-1">
                                <button
                                  onClick={() => setEditingNotes(null)}
                                  className="text-xs text-dark-300 hover:text-white px-2 py-1"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveNotes(hustle.id)}
                                  className="text-xs bg-hustle-600 text-white px-2 py-1 rounded"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            hustle.notes && !hustle.notes.includes('Saved from explore page') && !hustle.notes.includes('Created by user') && (
                              <div className="mb-2 text-xs text-dark-300 bg-dark-800 p-2 rounded">
                                {hustle.notes}
                              </div>
                            )
                          )}
                          
                          <div className="flex justify-between items-center border-t border-dark-600 pt-2 mt-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveHustle(hustle.id, 'in-progress');
                                }}
                                className="text-xs bg-hustle-600 hover:bg-hustle-500 text-white px-2 py-1 rounded transition-colors"
                              >
                                Start
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingNotes(hustle.id, hustle.notes || '');
                                }}
                                className="text-xs bg-dark-600 hover:bg-dark-500 text-dark-200 px-2 py-1 rounded flex items-center transition-colors"
                              >
                                <PenSquare size={10} className="mr-1" />
                                Notes
                              </button>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeHustle(hustle.id);
                              }}
                              className="text-dark-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full flex items-center justify-center p-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-hustle-300 hover:border-hustle-600 transition-colors"
                  >
                    <Plus size={16} className="mr-1" />
                    <span className="text-sm">Create Hustle</span>
                  </button>
                </div>
              </div>
              
              {/* In Progress Column */}
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-mono font-bold text-lg">In Progress</h2>
                  <span className="bg-dark-700 text-dark-300 text-xs rounded-full px-2 py-0.5">
                    {inProgressHustles.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {inProgressHustles.length === 0 ? (
                    <div className="text-center p-4 border border-dashed border-dark-600 rounded-lg">
                      <p className="text-dark-400 text-sm">Move hustles here when you start working on them</p>
                    </div>
                  ) : (
                    inProgressHustles.map(hustle => (
                      <motion.div
                        key={hustle.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-700 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleHustleClick(hustle)}
                      >
                        <div className="h-24 overflow-hidden">
                          <img
                            src={hustle.image}
                            alt={hustle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm mb-1">{hustle.title}</h3>
                          
                          {/* Progress bar if available */}
                          {hustle.progress !== null && hustle.progress > 0 && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-dark-400">Progress</span>
                                <span className="text-white">{hustle.progress}%</span>
                              </div>
                              <div className="w-full bg-dark-600 rounded-full h-1">
                                <div 
                                  className="bg-hustle-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${hustle.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {hustle.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 bg-dark-600 text-dark-300 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {hustle.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-dark-600 text-dark-300 rounded-full text-xs">
                                +{hustle.tags.length - 2}
                              </span>
                            )}
                          </div>
                          
                          {editingNotes === hustle.id ? (
                            <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="w-full p-2 bg-dark-800 border border-dark-600 rounded-md text-white text-xs focus:outline-none focus:ring-1 focus:ring-hustle-500"
                                placeholder="Add notes..."
                                rows={3}
                              />
                              <div className="flex justify-end space-x-2 mt-1">
                                <button
                                  onClick={() => setEditingNotes(null)}
                                  className="text-xs text-dark-300 hover:text-white px-2 py-1"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveNotes(hustle.id)}
                                  className="text-xs bg-hustle-600 text-white px-2 py-1 rounded"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            hustle.notes && !hustle.notes.includes('Saved from explore page') && !hustle.notes.includes('Created by user') && (
                              <div className="mb-2 text-xs text-dark-300 bg-dark-800 p-2 rounded">
                                {hustle.notes}
                              </div>
                            )
                          )}
                          
                          <div className="flex justify-between items-center border-t border-dark-600 pt-2 mt-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveHustle(hustle.id, 'launched');
                                }}
                                className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded transition-colors"
                              >
                                Launch 🚀
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingNotes(hustle.id, hustle.notes || '');
                                }}
                                className="text-xs bg-dark-600 hover:bg-dark-500 text-dark-200 px-2 py-1 rounded flex items-center transition-colors"
                              >
                                <PenSquare size={10} className="mr-1" />
                                Notes
                              </button>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeHustle(hustle.id);
                              }}
                              className="text-dark-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Launched Column */}
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-mono font-bold text-lg">Launched 🚀</h2>
                  <span className="bg-dark-700 text-dark-300 text-xs rounded-full px-2 py-0.5">
                    {launchedHustles.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {launchedHustles.length === 0 ? (
                    <div className="text-center p-4 border border-dashed border-dark-600 rounded-lg">
                      <p className="text-dark-400 text-sm">Move hustles here when you've launched them</p>
                    </div>
                  ) : (
                    launchedHustles.map(hustle => (
                      <motion.div
                        key={hustle.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-700 rounded-lg overflow-hidden cursor-pointer border border-green-800/30"
                        onClick={() => handleHustleClick(hustle)}
                      >
                        <div className="h-24 overflow-hidden">
                          <img
                            src={hustle.image}
                            alt={hustle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm mb-1">{hustle.title}</h3>
                          
                          {/* Progress bar (should be 100% for launched) */}
                          {hustle.progress !== null && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-dark-400">Progress</span>
                                <span className="text-white">{hustle.progress}%</span>
                              </div>
                              <div className="w-full bg-dark-600 rounded-full h-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${hustle.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {hustle.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 bg-dark-600 text-dark-300 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {hustle.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-dark-600 text-dark-300 rounded-full text-xs">
                                +{hustle.tags.length - 2}
                              </span>
                            )}
                          </div>
                          
                          {editingNotes === hustle.id ? (
                            <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="w-full p-2 bg-dark-800 border border-dark-600 rounded-md text-white text-xs focus:outline-none focus:ring-1 focus:ring-hustle-500"
                                placeholder="Add notes..."
                                rows={3}
                              />
                              <div className="flex justify-end space-x-2 mt-1">
                                <button
                                  onClick={() => setEditingNotes(null)}
                                  className="text-xs text-dark-300 hover:text-white px-2 py-1"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveNotes(hustle.id)}
                                  className="text-xs bg-hustle-600 text-white px-2 py-1 rounded"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            hustle.notes && !hustle.notes.includes('Saved from explore page') && !hustle.notes.includes('Created by user') && (
                              <div className="mb-2 text-xs text-dark-300 bg-dark-800 p-2 rounded">
                                {hustle.notes}
                              </div>
                            )
                          )}
                          
                          <div className="flex justify-between items-center border-t border-dark-600 pt-2 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingNotes(hustle.id, hustle.notes || '');
                              }}
                              className="text-xs bg-dark-600 hover:bg-dark-500 text-dark-200 px-2 py-1 rounded flex items-center transition-colors"
                            >
                              <PenSquare size={10} className="mr-1" />
                              Notes
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeHustle(hustle.id);
                              }}
                              className="text-dark-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateHustleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <HustleModal
        hustle={selectedHustle}
        isOpen={isHustleModalOpen}
        onClose={() => {
          setIsHustleModalOpen(false);
          setSelectedHustle(null);
        }}
        showTasks={selectedHustle && !selectedHustle.notes?.includes('Saved from explore page')}
      />
    </div>
  );
};

export default DashboardPage;