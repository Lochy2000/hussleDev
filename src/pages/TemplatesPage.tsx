import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Search, Filter, X, Clock, Zap, Download } from 'lucide-react';
import { templateData } from '../data/hustleData';

const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilters, setTechFilters] = useState<string[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Get unique technologies across all templates
  const allTechnologies = Array.from(
    new Set(
      templateData.flatMap(template => template.technologies)
    )
  ).sort();

  // Filter templates based on search and tech filters
  const filteredTemplates = templateData.filter(template => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply tech filters
    const matchesTech = techFilters.length === 0 || 
      techFilters.some(tech => template.technologies.includes(tech));

    return matchesSearch && matchesTech;
  });

  const toggleTechFilter = (tech: string) => {
    setTechFilters(prev => 
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const resetFilters = () => {
    setTechFilters([]);
  };

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
            {techFilters.length > 0 && (
              <span className="ml-2 bg-hustle-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {techFilters.length}
              </span>
            )}
          </button>

          {techFilters.length > 0 && (
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
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTechnologies.map(tech => (
                <button
                  key={tech}
                  onClick={() => toggleTechFilter(tech)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    techFilters.includes(tech)
                      ? 'bg-hustle-500 text-white'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-dark-400 text-sm">
          Showing {filteredTemplates.length} templates
        </p>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card overflow-hidden flex flex-col h-full group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {template.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-dark-700/80 backdrop-blur-sm text-white rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-mono font-medium mb-2">{template.title}</h3>
                <p className="text-dark-300 mb-4 flex-1">{template.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="flex items-center text-dark-300">
                    <Zap size={14} className="mr-1" />
                    Complexity: {template.complexity}
                  </div>
                  <div className="flex items-center text-dark-300">
                    <Clock size={14} className="mr-1" />
                    Setup: {template.setupTime}
                  </div>
                </div>
                
                <button className="btn btn-primary neon-glow neon-purple w-full flex items-center justify-center">
                  <Code size={16} className="mr-2" />
                  Remix this Hustle
                </button>
              </div>
            </motion.div>
          ))}
        </div>
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