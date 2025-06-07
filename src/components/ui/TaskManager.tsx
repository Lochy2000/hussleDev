import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Edit3,
  Sparkles,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useHustleTasks } from '../../hooks/useHustleTasks';
import { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type HustleTask = Database['public']['Tables']['hustle_tasks']['Row'];
type Hustle = Database['public']['Tables']['hustles']['Row'];

interface TaskManagerProps {
  hustle: Hustle;
  onProgressUpdate?: () => void;
}

const CATEGORY_COLORS = {
  development: 'bg-blue-500',
  design: 'bg-purple-500',
  marketing: 'bg-green-500',
  research: 'bg-yellow-500',
  testing: 'bg-red-500',
  planning: 'bg-gray-500',
  deployment: 'bg-orange-500'
};

const PRIORITY_COLORS = {
  low: 'text-gray-400',
  medium: 'text-yellow-400',
  high: 'text-red-400'
};

const TaskManager: React.FC<TaskManagerProps> = ({ hustle, onProgressUpdate }) => {
  const { getTasks, createTask, updateTask, deleteTask, generateAITasks, loading } = useHustleTasks();
  const [tasks, setTasks] = useState<HustleTask[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'development' as const,
    priority: 'medium' as const,
    estimated_hours: 2
  });

  useEffect(() => {
    loadTasks();
  }, [hustle.id]);

  const loadTasks = async () => {
    try {
      const taskData = await getTasks(hustle.id);
      setTasks(taskData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const task = await createTask({
        hustle_id: hustle.id,
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        estimated_hours: newTask.estimated_hours,
        order_index: tasks.length
      });

      setTasks(prev => [...prev, task]);
      setNewTask({
        title: '',
        description: '',
        category: 'development',
        priority: 'medium',
        estimated_hours: 2
      });
      setIsCreating(false);
      toast.success('Task created successfully!');
      onProgressUpdate?.();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleTask = async (task: HustleTask) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    
    try {
      const updatedTask = await updateTask(task.id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      
      if (newStatus === 'completed') {
        toast.success('Task completed! 🎉');
      }
      onProgressUpdate?.();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
      onProgressUpdate?.();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleGenerateAITasks = async () => {
    if (tasks.length > 0 && !confirm('This will add AI-generated tasks to your existing tasks. Continue?')) {
      return;
    }

    try {
      const aiTasks = await generateAITasks(hustle.id, hustle);
      setTasks(prev => [...prev, ...aiTasks]);
      onProgressUpdate?.();
    } catch (error) {
      console.error('Error generating AI tasks:', error);
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-mono font-medium">Tasks & Progress</h3>
          <p className="text-sm text-dark-300">
            {completedTasks} of {totalTasks} tasks completed ({progressPercentage}%)
          </p>
        </div>
        
        <div className="flex gap-2">
          {tasks.length === 0 && (
            <button
              onClick={handleGenerateAITasks}
              disabled={loading}
              className="btn btn-secondary flex items-center text-sm"
            >
              {loading ? (
                <RotateCcw size={14} className="mr-1 animate-spin" />
              ) : (
                <Sparkles size={14} className="mr-1" />
              )}
              AI Generate
            </button>
          )}
          
          <button
            onClick={() => setIsCreating(true)}
            className="btn btn-primary flex items-center text-sm"
          >
            <Plus size={14} className="mr-1" />
            Add Task
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="w-full bg-dark-700 rounded-full h-2">
          <motion.div
            className="bg-hustle-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Task Creation Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-700 rounded-lg p-4 border border-dark-600"
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500"
                autoFocus
              />
              
              <textarea
                placeholder="Task description (optional)..."
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500"
              />
              
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value as any }))}
                  className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500"
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="research">Research</option>
                  <option value="testing">Testing</option>
                  <option value="planning">Planning</option>
                  <option value="deployment">Deployment</option>
                </select>
                
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Hours"
                  value={newTask.estimated_hours}
                  onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: parseInt(e.target.value) || 0 }))}
                  className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-hustle-500"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1 text-sm text-dark-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={!newTask.title.trim()}
                  className="btn btn-primary text-sm"
                >
                  Create Task
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-dark-400">
            <div className="mb-4">
              <CheckCircle2 size={48} className="mx-auto text-dark-600" />
            </div>
            <p className="mb-4">No tasks yet. Break down your hustle into actionable steps!</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleGenerateAITasks}
                disabled={loading}
                className="btn btn-secondary flex items-center"
              >
                {loading ? (
                  <RotateCcw size={16} className="mr-2 animate-spin" />
                ) : (
                  <Sparkles size={16} className="mr-2" />
                )}
                Generate with AI
              </button>
              <button
                onClick={() => setIsCreating(true)}
                className="btn btn-primary flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Manually
              </button>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border transition-all ${
                task.status === 'completed'
                  ? 'bg-dark-700/50 border-dark-600 opacity-75'
                  : 'bg-dark-700 border-dark-600 hover:border-dark-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleTask(task)}
                  className="mt-0.5 text-hustle-400 hover:text-hustle-300"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium text-sm ${
                      task.status === 'completed' ? 'line-through text-dark-400' : 'text-white'
                    }`}>
                      {task.title}
                    </h4>
                    
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[task.category]}`} />
                      <span className="text-xs text-dark-400 capitalize">{task.category}</span>
                    </div>
                    
                    {task.ai_generated && (
                      <Sparkles size={12} className="text-purple-400" />
                    )}
                  </div>
                  
                  {task.description && (
                    <p className={`text-xs mb-2 ${
                      task.status === 'completed' ? 'text-dark-500' : 'text-dark-300'
                    }`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-dark-400">
                    <span className={`flex items-center gap-1 ${PRIORITY_COLORS[task.priority]}`}>
                      <AlertCircle size={12} />
                      {task.priority}
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {task.estimated_hours}h
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-dark-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;