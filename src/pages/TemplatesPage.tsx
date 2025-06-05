import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Search, Filter, X, Clock, Zap, Download, Star, GitBranch, ExternalLink } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Full Stack',
  'Frontend',
  'Backend',
  'Mobile',
  'AI/ML',
  'DevOps',
  'E-commerce',
  'Dashboard',
  'API',
  'Other'
];

const FRAMEWORKS = [
  'React',
  'Next.js',
  'Vue',
  'Nuxt',
  'Angular',
  'Svelte',
  'Express',
  'NestJS',
  'Django',
  'Flask'
];

const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [complexity, setComplexity] = useState('');
  const [category, setCategory] = useState('');
  const [framework, setFramework] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { 
    templates, 
    loading, 
    error, 
    hasMore, 
    fetchTemplates,
    incrementDownloads 
  } = useTemplates();

  const { ref } = useInfiniteScroll({
    onLoadMore: () => {
      if (!loading && hasMore) {
        setPage(prev => prev + 1);
      }
    },
    hasMore,
    loading
  });

  useEffect(() => {
    fetchTemplates({
      page: 1,
      search: searchTerm,
      technologies: selectedTechnologies,
      complexity,
      category,
      framework,
      sortBy,
      sortOrder
    });
  }, [searchTerm, selectedTechnologies, complexity, category, framework, sortBy, sortOrder]);

  useEffect(() => {
    if (page > 1) {
      fetchTemplates({
        page,
        search: searchTerm,
        technologies: selectedTechnologies,
        complexity,
        category,
        framework,
        sortBy,
        sortOrder
      });
    }
  }, [page]);

  const handleDownload = async (templateId: string, repoUrl: string) => {
    try {
      await incrementDownloads(templateId);
      window.open(repoUrl, '_blank');
      toast.success('Template repository opened');
    } catch (error) {
      toast.error('Failed to track download');
    }
  };

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedTechnologies([]);
    setComplexity('');
    setCategory('');
    setFramework('');
    setSortBy('created_at');
    setSortOrder('desc');
    setPage(1);
  };

  if (error) {
    return (
      <div className="container mx-auto pb-12">
        <div className="text-center py-12">
          <div className="bg-red-900/20 inline-flex rounded-full p-3 mb-4">
            <X size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-mono font-medium mb-2">Failed to load templates</h3>
          <p className="text-dark-300 mb-6">
            {error.message || 'An error occurred while loading the templates'}
          </p>
          <button 
            onClick={() => fetchTemplates()}
            className="btn btn-secondary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-2">Templates Hub</h1>
        <p className="text-dark-300">Ready-to-use starter templates to accelerate your side hustle</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
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
            {(selectedTechnologies.length > 0 || complexity || category || framework) && (
              <span className="ml-2 bg-hustle-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {selectedTechnologies.length + (complexity ? 1 : 0) + (category ? 1 : 0) + (framework ? 1 : 0)}
              </span>
            )}
          </button>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
              setPage(1);
            }}
            className="bg-dark-800 border border-dark-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="downloads-desc">Most Downloaded</option>
            <option value="stars-desc">Most Popular</option>
            <option value="setup_time-asc">Quick Setup</option>
          </select>

          {(selectedTechnologies.length > 0 || complexity || category || framework || sortBy !== 'created_at' || sortOrder !== 'desc') && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Vue', 'Angular', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'PostgreSQL'].map(tech => (
                  <button
                    key={tech}
                    onClick={() => toggleTechnology(tech)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedTechnologies.includes(tech)
                        ? 'bg-hustle-500 text-white'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                Complexity
              </h3>
              <div className="flex gap-2">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => {
                      setComplexity(complexity === level ? '' : level);
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      complexity === level
                        ? 'bg-hustle-500 text-white'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                Category
              </h3>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                Framework
              </h3>
              <select
                value={framework}
                onChange={(e) => {
                  setFramework(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
              >
                <option value="">All Frameworks</option>
                {FRAMEWORKS.map(fw => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-dark-400 text-sm">
          Showing {templates.length} templates
        </p>
      </div>

      {/* Templates Grid */}
      {loading && templates.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      ) : templates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="card overflow-hidden flex flex-col h-full group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={template.image_url}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {template.technologies.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-dark-700/80 backdrop-blur-sm text-white rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {template.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-dark-700/80 backdrop-blur-sm text-white rounded-full text-xs">
                        +{template.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-mono font-medium">{template.title}</h3>
                    <div className="flex items-center space-x-2 text-dark-300">
                      <span className="flex items-center">
                        <Star size={14} className="mr-1" />
                        {template.stars}
                      </span>
                      <span className="flex items-center">
                        <Download size={14} className="mr-1" />
                        {template.downloads}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-dark-300 mb-4 flex-1">{template.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="flex items-center text-dark-300">
                      <Zap size={14} className="mr-1" />
                      {template.complexity}
                    </div>
                    <div className="flex items-center text-dark-300">
                      <Clock size={14} className="mr-1" />
                      {template.setup_time}min setup
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownload(template.id, template.repository_url)}
                      className="btn btn-primary neon-glow neon-purple flex-1 flex items-center justify-center"
                    >
                      <GitBranch size={16} className="mr-2" />
                      Clone Template
                    </button>
                    {template.preview_url && (
                      <a
                        href={template.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary flex items-center"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
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
          <h3 className="text-xl font-mono font-medium mb-2">No templates found</h3>
          <p className="text-dark-300 mb-6">
            Try adjusting your search terms or filters
          </p>
          <button onClick={resetFilters} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;