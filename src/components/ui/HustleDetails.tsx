import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Code, Link, Github, Globe, Calendar } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Hustle = Database['public']['Tables']['hustles']['Row'];

interface HustleDetailsProps {
  hustle: Hustle;
  showActions?: boolean;
  onStatusChange?: (status: 'saved' | 'in-progress' | 'launched') => void;
  onPriorityChange?: (priority: 'low' | 'medium' | 'high') => void;
  onMilestoneAdd?: (milestone: string) => void;
  onMilestoneComplete?: (index: number) => void;
}

const HustleDetails: React.FC<HustleDetailsProps> = ({
  hustle,
  showActions = false,
  onStatusChange,
  onPriorityChange,
  onMilestoneAdd,
  onMilestoneComplete,
}) => {
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

        {showActions && (
          <>
            <div className="mb-6">
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

            <div className="mb-6">
              <h4 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                Milestones
              </h4>
              <div className="space-y-2">
                {hustle.milestones && Array.isArray(JSON.parse(hustle.milestones as string)) && 
                  JSON.parse(hustle.milestones as string).map((milestone: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-dark-700 rounded-md"
                    >
                      <span className={milestone.completed ? 'text-dark-400 line-through' : 'text-white'}>
                        {milestone.text}
                      </span>
                      {!milestone.completed && (
                        <button
                          onClick={() => onMilestoneComplete?.(index)}
                          className="text-hustle-300 hover:text-hustle-200"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  ))
                }
                <button
                  onClick={() => {
                    const milestone = window.prompt('Enter new milestone:');
                    if (milestone) onMilestoneAdd?.(milestone);
                  }}
                  className="w-full p-2 border-2 border-dashed border-dark-600 rounded-md text-dark-400 hover:text-white hover:border-dark-500 transition-colors"
                >
                  + Add Milestone
                </button>
              </div>
            </div>

            {(hustle.github_url || hustle.website_url) && (
              <div className="mb-6">
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

            {hustle.due_date && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-2">
                  Due Date
                </h4>
                <div className="flex items-center text-dark-300">
                  <Calendar size={16} className="mr-2" />
                  {new Date(hustle.due_date).toLocaleDateString()}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HustleDetails;