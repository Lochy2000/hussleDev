import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, X, Bookmark, BookmarkCheck, Clock, DollarSign, Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useHustleManagement } from '../hooks/useHustleManagement';
import HustleModal from '../components/ui/HustleModal';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Hustle = Database['public']['Tables']['hustles']['Row'];

const ExplorePage = () => {
  const { currentUser } = useAuth();
  const { createHustle } = useHustleManagement();
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [earningFilter, setEarningFilter] = useState<string>('');
  const [savedHustles, setSavedHustles] = useState<string[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedHustle, setSelectedHustle] = useState<Hustle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load hustles from API
  useEffect(() => {
    // For now, we'll use the mock data
    setHustles(hustleData);
  }, []);

  // Load saved hustles for the current user
  useEffect(() => {
    if (currentUser) {
      // TODO: Load saved hustles from the database
      const saved = localStorage.getItem('savedHustles');
      if (saved) {
        setSavedHustles(JSON.parse(saved));
      }
    }
  }, [currentUser]);

  const handleSaveHustle = async (hustle: Hustle) => {
    if (!currentUser) {
      toast.error('Please sign in to save hustles');
      return;
    }

    try {
      // Create a new hustle record for the user
      await createHustle({
        title: hustle.title,
        description: hustle.description,
        tags: hustle.tags,
        time_commitment: hustle.time_commitment,
        earning_potential: hustle.earning_potential,
        image: hustle.image,
        tools: hustle.tools,
      });

      setSavedHustles(prev => [...prev, hustle.id]);
      localStorage.setItem('savedHustles', JSON.stringify([...savedHustles, hustle.id]));
      toast.success('Hustle saved successfully');
    } catch (error) {
      console.error('Error saving hustle:', error);
      toast.error('Failed to save hustle');
    }
  };

  const handleHustleClick = (hustle: Hustle) => {
    setSelectedHustle(hustle);
    setIsModalOpen(true);
  };

  // Filter hustles based on search and filters
  const filteredHustles = hustles.filter(hustle => {
    const matchesSearch = searchTerm === '' || 
      hustle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hustle.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => hustle.tags.includes(tag));

    const matchesTime = !timeFilter || hustle.time_commitment === timeFilter;
    const matchesEarning = !earningFilter || hustle.earning_potential === earningFilter;

    return matchesSearch && matchesTags && matchesTime && matchesEarning;
  });

  return (
    <div className="container mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-2">Explore Side Hustles</h1>
        <p className="text-dark-300">Discover developer side hustle ideas and start building today</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search side hustles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="btn btn-secondary flex items-center"
          >
            <Filter size={16} className="mr-2" />
            Filters
            {(selectedTags.length > 0 || timeFilter || earningFilter) && (
              <span className="ml-2 bg-hustle-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {selectedTags.length + (timeFilter ? 1 : 0) + (earningFilter ? 1 : 0)}
              </span>
            )}
          </button>

          {(selectedTags.length > 0 || timeFilter || earningFilter) && (
            <button
              onClick={() => {
                setSelectedTags([]);
                setTimeFilter('');
                setEarningFilter('');
              }}
              className="btn btn-outline flex items-center"
            >
              <X size={16} className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {isFilterMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 p-4 bg-dark-800 rounded-lg border border-dark-700"
        >
          <div className="mb-4">
            <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTags.includes(tag)
                      ? 'bg-hustle-500 text-white'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2 flex items-center">
                <Clock size={14} className="mr-1" />
                Time Commitment
              </h3>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(time => (
                  <button
                    key={time}
                    onClick={() => setTimeFilter(timeFilter === time ? '' : time)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      timeFilter === time
                        ? 'bg-hustle-500 text-white'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2 flex items-center">
                <DollarSign size={14} className="mr-1" />
                Earning Potential
              </h3>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(earning => (
                  <button
                    key={earning}
                    onClick={() => setEarningFilter(earningFilter === earning ? '' : earning)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      earningFilter === earning
                        ? 'bg-hustle-500 text-white'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    {earning}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mb-6">
        <p className="text-dark-400 text-sm">
          Showing {filteredHustles.length} side hustle ideas
        </p>
      </div>

      {filteredHustles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHustles.map((hustle, index) => (
            <motion.div
              key={hustle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card overflow-hidden flex flex-col h-full group cursor-pointer"
              onClick={() => handleHustleClick(hustle)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hustle.image}
                  alt={hustle.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveHustle(hustle);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dark-900/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-dark-800 transition-colors"
                >
                  {savedHustles.includes(hustle.id) ? (
                    <BookmarkCheck size={16} className="text-hustle-300" />
                  ) : (
                    <Bookmark size={16} />
                  )}
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-mono font-medium mb-2">{hustle.title}</h3>
                <p className="text-dark-300 mb-4 flex-1">{hustle.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {hustle.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-dark-700 text-dark-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-dark-300">
                    <Clock size={14} className="mr-1" />
                    <span className="capitalize">{hustle.time_commitment}</span> time
                  </div>
                  <div className="flex items-center text-dark-300">
                    <DollarSign size={14} className="mr-1" />
                    <span className="capitalize">{hustle.earning_potential}</span> earnings
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <div className="flex items-center text-dark-300 text-sm">
                    <Code size={14} className="mr-1" />
                    {hustle.tools.join(', ')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-dark-800 inline-flex rounded-full p-3 mb-4">
            <Search size={24} className="text-dark-400" />
          </div>
          <h3 className="text-xl font-mono font-medium mb-2">No results found</h3>
          <p className="text-dark-300 mb-6">
            Try adjusting your search terms or filters
          </p>
          <button 
            onClick={() => {
              setSelectedTags([]);
              setTimeFilter('');
              setEarningFilter('');
            }} 
            className="btn btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      )}

      <HustleModal
        hustle={selectedHustle}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHustle(null);
        }}
        onSave={(id) => selectedHustle && handleSaveHustle(selectedHustle)}
        isSaved={selectedHustle ? savedHustles.includes(selectedHustle.id) : false}
      />
    </div>
  );
};

export default ExplorePage;