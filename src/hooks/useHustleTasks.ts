import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type HustleTask = Database['public']['Tables']['hustle_tasks']['Row'];
type HustleTaskInsert = Database['public']['Tables']['hustle_tasks']['Insert'];
type HustleTaskUpdate = Database['public']['Tables']['hustle_tasks']['Update'];

interface UseHustleTasksResult {
  loading: boolean;
  error: Error | null;
  getTasks: (hustleId: string) => Promise<HustleTask[]>;
  createTask: (task: HustleTaskInsert) => Promise<HustleTask>;
  updateTask: (id: string, updates: HustleTaskUpdate) => Promise<HustleTask>;
  deleteTask: (id: string) => Promise<void>;
  generateAITasks: (hustleId: string, hustleData: any) => Promise<HustleTask[]>;
}

export function useHustleTasks(): UseHustleTasksResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getTasks = useCallback(async (hustleId: string): Promise<HustleTask[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hustle_tasks')
        .select('*')
        .eq('hustle_id', hustleId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task: HustleTaskInsert): Promise<HustleTask> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hustle_tasks')
        .insert(task)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to create task');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: HustleTaskUpdate): Promise<HustleTask> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hustle_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to update task');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('hustle_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to delete task');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAITasks = useCallback(async (hustleId: string, hustleData: any): Promise<HustleTask[]> => {
    try {
      setLoading(true);
      setError(null);

      // Generate AI tasks using Gemini
      const { generateHustleIdea } = await import('../lib/gemini');
      
      const prompt = `
        Break down this side hustle project into specific, actionable tasks:
        
        Title: ${hustleData.title}
        Description: ${hustleData.description}
        Tech Stack: ${hustleData.tools.join(', ')}
        Time Commitment: ${hustleData.time_commitment}
        Category: ${hustleData.category || 'General'}
        
        Please provide 8-12 specific tasks that cover the complete development lifecycle. For each task, provide:
        1. A clear, actionable title (max 60 characters)
        2. A brief description (1-2 sentences)
        3. Category (development, design, marketing, research, testing, planning, deployment)
        4. Priority (low, medium, high)
        5. Estimated hours (realistic estimate)
        
        Format as JSON array:
        [
          {
            "title": "Task title",
            "description": "Task description",
            "category": "development",
            "priority": "high",
            "estimated_hours": 4
          }
        ]
        
        Focus on practical, specific tasks that a developer can actually complete. Include tasks for planning, development, testing, and launch.
      `;

      const response = await generateHustleIdea(prompt);
      
      // Parse AI response
      let aiTasks;
      try {
        // Extract JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        aiTasks = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Fallback to default tasks
        aiTasks = getDefaultTasks(hustleData);
      }

      // Create tasks in database
      const createdTasks: HustleTask[] = [];
      for (let i = 0; i < aiTasks.length; i++) {
        const aiTask = aiTasks[i];
        const task = await createTask({
          hustle_id: hustleId,
          title: aiTask.title,
          description: aiTask.description,
          category: aiTask.category,
          priority: aiTask.priority,
          estimated_hours: aiTask.estimated_hours || 2,
          ai_generated: true,
          order_index: i
        });
        createdTasks.push(task);
      }

      toast.success(`Generated ${createdTasks.length} AI tasks for your hustle!`);
      return createdTasks;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to generate AI tasks');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [createTask]);

  return {
    loading,
    error,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    generateAITasks,
  };
}

// Fallback tasks if AI generation fails
function getDefaultTasks(hustleData: any) {
  return [
    {
      title: "Project Planning & Requirements",
      description: "Define project scope, features, and technical requirements",
      category: "planning",
      priority: "high",
      estimated_hours: 4
    },
    {
      title: "Set up Development Environment",
      description: "Initialize project, configure tools, and set up repository",
      category: "development",
      priority: "high",
      estimated_hours: 2
    },
    {
      title: "Design User Interface",
      description: "Create wireframes and design the user interface",
      category: "design",
      priority: "medium",
      estimated_hours: 6
    },
    {
      title: "Implement Core Features",
      description: "Build the main functionality of the application",
      category: "development",
      priority: "high",
      estimated_hours: 20
    },
    {
      title: "Add Authentication",
      description: "Implement user registration and login system",
      category: "development",
      priority: "medium",
      estimated_hours: 4
    },
    {
      title: "Testing & Bug Fixes",
      description: "Test all features and fix any bugs found",
      category: "testing",
      priority: "high",
      estimated_hours: 8
    },
    {
      title: "Deploy to Production",
      description: "Set up hosting and deploy the application",
      category: "deployment",
      priority: "medium",
      estimated_hours: 3
    },
    {
      title: "Marketing & Launch",
      description: "Create landing page and launch marketing campaign",
      category: "marketing",
      priority: "medium",
      estimated_hours: 10
    }
  ];
}