import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Code, Link, Github, Globe, Calendar, CheckCircle, Target } from 'lucide-react';
import { Database } from '../../lib/database.types';
import TaskManager from './TaskManager';

type Hustle = Database['public']['Tables']['hustles']['Row'];

interface HustleDetailsProps {
  hustle: Hustle;
  showActions?: boolean;
  onStatusChange?: (status: 'saved' | 'in-progress' | 'launched') => void;
  onPriorityChange?: (priority: 'low' | 'medium' | 'high') => void;
  onMilestoneAdd?: (milestone: string) => void;
  onMilestoneComplete?: (index: number) => void;
  onProgressUpdate?: () => void;
}

const HustleDetails: React.FC<HustleDetailsProps> = ({
  hustle,
  showActions = false,
  onStatusChange,
  onPriorityChange,
  onMilestoneAdd,
  onMilestoneComplete,
  onProgressUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
      <div className="relative h-48">
        <img
          src={hustle.image}
          alt={hustle.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
        
        {showActions && (
          <div className="absolute top-4 right-4 flex space-x-2">
            <select
              value={hustle.priority || 'low'}
              onChange={(e) => onPriorityChange?.(e.target.value as 'low' | 'medium' | 'high')}
              className="px-3 py-1 bg-dark-900/80 backdrop-blur-sm text-white rounded-full text-sm border border-dark-700"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-mono font-medium mb-2">{hustle.title}</h3>
        <p className="text-dark-300 mb-4">{hustle.description}</p>

        {/* Progress Bar */}
        {hustle.progress !== null && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-dark-300">Progress</span>
              <span className="text-sm text-white">{hustle.progress}%</span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <motion.div 
                className="bg-hustle-500 h-2 rounded-full transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${hustle.progress}%` }}
              />
            </div>
          </div>
        )}

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
          <h4 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
            Tech Stack
          </h4>
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

        {/* Tab Navigation */}
        {showActions && (
          <>
            <div className="flex border-b border-dark-700 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-hustle-500 text-white'
                    : 'border-transparent text-dark-300 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'tasks'
                    ? 'border-hustle-500 text-white'
                    : 'border-transparent text-dark-300 hover:text-white'
                }`}
              >
                Tasks & Progress
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                    Status
                  </h4>
                  <div className="flex space-x-2">
                    {(['saved', 'in-progress', 'launched'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => onStatusChange?.(status)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          hustle.status === status
                            ? 'bg-hustle-500 text-white'
                            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                        }`}
                      >
                        {status === 'saved' ? 'Backlog' : status === 'in-progress' ? 'In Progress' : 'Launched'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Revenue Tracking */}
                {(hustle.current_revenue !== null || hustle.revenue_target !== null) && (
                  <div>
                    <h4 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                      Revenue
                    </h4>
                    <div className="bg-dark-700 rounded-lg p-4 space-y-3">
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

                {/* Links */}
                {(hustle.github_url || hustle.website_url) && (
                  <div>
                    <h4 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                      Links
                    </h4>
                    <div className="flex space-x-4">
                      {hustle.github_url && (
                        <a
                          href={hustle.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-dark-300 hover:text-white"
                        >
                          <Github size={16} className="mr-1" />
                          Repository
                        </a>
                      )}
                      {hustle.website_url && (
                        <a
                          href={hustle.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-dark-300 hover:text-white"
                        >
                          <Globe size={16} className="mr-1" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                {hustle.due_date && (
                  <div>
                    <h4 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                      Due Date
                    </h4>
                    <div className="flex items-center text-dark-300">
                      <Calendar size={16} className="mr-2" />
                      {new Date(hustle.due_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <TaskManager hustle={hustle} onProgressUpdate={onProgressUpdate} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HustleDetails;