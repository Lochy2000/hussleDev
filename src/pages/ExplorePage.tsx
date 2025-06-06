import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, X, Bookmark, BookmarkCheck, Clock, DollarSign, Code, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useHustleManagement } from '../hooks/useHustleManagement';
import { useExploreHustles } from '../hooks/useExploreHustles';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import HustleModal from '../components/ui/HustleModal';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Hustle = Database['public']['Tables']['hustles']['Row'];

const CATEGORIES = [
  'SaaS',
  'Mobile App',
  'Browser Extension',
  'Developer Tool',
  'API Service',
  'Content Platform',
  'E-commerce',
  'AI/ML',
  'Web3',
  'Other',
];

const ExplorePage = () => {
  const { currentUser } = useAuth();
  const { createHustle } = useHustleManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [earningFilter, setEarningFilter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'earning_potential'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [savedHustleIds, setSavedHustleIds] = useState<Set<string>>(new Set());
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedHustle, setSelectedHustle] = useState<Hustle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hustles, loading, error, hasMore, loadMore, refetch } = useExploreHustles({
    search: searchTerm,
    tags: selectedTags,
    timeCommitment: timeFilter || undefined,
    earningPotential: earningFilter || undefined,
    category: category || undefined,
    sortBy,
    sortOrder,
  });

  const { ref } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading,
  });

  useEffect(() => {
    if (currentUser) {
      // Load saved hustle IDs from localStorage for quick UI feedback
      const saved = localStorage.getItem(`savedHustles_${currentUser.id}`);
      if (saved) {
        setSavedHustleIds(new Set(JSON.parse(saved)));
      }
    }
  }, [currentUser]);

  const handleSaveHustle = async (hustle: Hustle) => {
    if (!currentUser) {
      toast.error('Please sign in to save hustles');
      return;
    }

    // Check if already saved
    if (savedHustleIds.has(hustle.id)) {
      toast.info('This hustle is already saved to your dashboard');
      return;
    }

    try {
      // Create a copy of the hustle in the user's account
      await createHustle({
        title: hustle.title,
        description: hustle.description,
        tags: hustle.tags,
        time_commitment: hustle.time_commitment,
        earning_potential: hustle.earning_potential,
        image: hustle.image,
        tools: hustle.tools,
        category: hustle.category,
        notes: `Saved from explore page on ${new Date().toLocaleDateString()}`
      });

      // Update local state for immediate UI feedback
      const newSavedIds = new Set(savedHustleIds);
      newSavedIds.add(hustle.id);
      setSavedHustleIds(newSavedIds);
      
      // Save to localStorage for persistence
      localStorage.setItem(`savedHustles_${currentUser.id}`, JSON.stringify([...newSavedIds]));
      
      toast.success('Hustle saved to your dashboard!');
    } catch (error) {
      console.error('Error saving hustle:', error);
      toast.error('Failed to save hustle');
    }
  };

  const handleHustleClick = (hustle: Hustle) => {
    setSelectedHustle(hustle);
    setIsModalOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSelectedTags([]);
    setTimeFilter('');
    setEarningFilter('');
    setCategory('');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  if (error) {
    return (
      <div className="container mx-auto pb-12">
        <div className="text-center py-12">
          <div className="bg-red-900/20 inline-flex rounded-full p-3 mb-4">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-mono font-medium mb-2">Failed to load hustles</h3>
          <p className="text-dark-300 mb-6">
            {error.message || 'An error occurred while loading the hustles. Please try again.'}
          </p>
          <button onClick={() => refetch()} className="btn btn-secondary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-2">Explore Side Hustles</h1>
        <p className="text-dark-300">Discover developer side hustle ideas and start building today</p>
      </div>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              category === ''
                ? 'bg-hustle-500 text-white'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === category ? '' : cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-hustle-500 text-white'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter Section */}
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

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as ['created_at' | 'title' | 'earning_potential', 'asc' | 'desc'];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="bg-dark-800 border border-dark-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="earning_potential-desc">Highest Earning</option>
            <option value="earning_potential-asc">Lowest Earning</option>
          </select>

          {(selectedTags.length > 0 || timeFilter || earningFilter || category || sortBy !== 'created_at' || sortOrder !== 'desc') && (
            <button
              onClick={resetFilters}
              className="btn btn-outline flex items-center"
            >
              <X size={16} className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Menu */}
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
              {['frontend', 'backend', 'fullstack', 'mobile', 'ai', 'web3', 'tool', 'saas'].map(tag => (
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

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-dark-400 text-sm">
          Showing {hustles.length} side hustle ideas
        </p>
      </div>

      {/* Hustles Grid */}
      {loading && hustles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      ) : hustles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hustles.map((hustle, index) => (
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
                    {savedHustleIds.has(hustle.id) ? (
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

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={ref} className="py-8 flex justify-center">
              {loading && (
                <div className="w-8 h-8 border-4 border-hustle-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          )}
        </>
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
            onClick={resetFilters}
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
        isSaved={selectedHustle ? savedHustleIds.has(selectedHustle.id) : false}
      />
    </div>
  );
};

export default ExplorePage;