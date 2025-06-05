import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Template = Database['public']['Tables']['templates']['Row'];

interface UseTemplatesResult {
  loading: boolean;
  error: Error | null;
  templates: Template[];
  hasMore: boolean;
  fetchTemplates: (options?: {
    page?: number;
    limit?: number;
    search?: string;
    technologies?: string[];
    complexity?: string;
    category?: string;
    framework?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => Promise<void>;
  getTemplate: (id: string) => Promise<Template>;
  incrementDownloads: (id: string) => Promise<void>;
}

export function useTemplates(): UseTemplatesResult {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchTemplates = useCallback(async (options = {}) => {
    const {
      page = 1,
      limit = 12,
      search = '',
      technologies = [],
      complexity,
      category,
      framework,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('templates')
        .select('*', { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (technologies.length > 0) {
        query = query.contains('technologies', technologies);
      }

      if (complexity) {
        query = query.eq('complexity', complexity);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (framework) {
        query = query.eq('framework', framework);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const start = (page - 1) * limit;
      query = query.range(start, start + limit - 1);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setTemplates(prev => page === 1 ? data || [] : [...prev, ...(data || [])]);
      setHasMore(count ? start + limit < count : false);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplate = useCallback(async (id: string): Promise<Template> => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Template not found');

      return data;
    } catch (err) {
      const error = err as Error;
      toast.error('Failed to load template');
      throw error;
    }
  }, []);

  const incrementDownloads = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('increment_template_downloads', {
        template_id: id
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error incrementing downloads:', err);
    }
  }, []);

  return {
    loading,
    error,
    templates,
    hasMore,
    fetchTemplates,
    getTemplate,
    incrementDownloads
  };
}