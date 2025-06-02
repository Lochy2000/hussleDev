import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Hustle = Database['public']['Tables']['hustles']['Row'];

interface GetHustlesOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tags?: string[];
}

export function useSupabase() {
  const getHustles = useCallback(async (userId: string, options: GetHustlesOptions = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status,
        tags = []
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('hustles')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply status filter
      if (status) {
        query = query.eq('status', status);
      }

      // Apply tags filter
      if (tags.length > 0) {
        query = query.contains('tags', tags);
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count: count || 0, page, limit };
    } catch (error) {
      console.error('Error fetching hustles:', error);
      throw error;
    }
  }, []);

  const createHustle = useCallback(async (hustle: Omit<Hustle, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hustles')
        .insert(hustle)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating hustle:', error);
      throw error;
    }
  }, []);

  const updateHustle = useCallback(async (id: string, updates: Partial<Hustle>) => {
    try {
      const { data, error } = await supabase
        .from('hustles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating hustle:', error);
      throw error;
    }
  }, []);

  const deleteHustle = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('hustles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting hustle:', error);
      throw error;
    }
  }, []);

  return {
    getHustles,
    createHustle,
    updateHustle,
    deleteHustle,
  };
}