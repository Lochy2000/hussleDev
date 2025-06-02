import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Hustle = Database['public']['Tables']['hustles']['Row'];
type HustleInsert = Database['public']['Tables']['hustles']['Insert'];
type HustleUpdate = Database['public']['Tables']['hustles']['Update'];

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

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (tags.length > 0) {
        query = query.contains('tags', tags);
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count: count || 0, page, limit };
    } catch (error) {
      console.error('Error fetching hustles:', error);
      throw error;
    }
  }, []);

  const createHustle = useCallback(async (hustle: HustleInsert) => {
    try {
      const { data, error } = await supabase
        .from('hustles')
        .insert(hustle)
        .select()
        .single();

      if (error) throw error;
      toast.success('Hustle created successfully');
      return data;
    } catch (error) {
      console.error('Error creating hustle:', error);
      toast.error('Failed to create hustle');
      throw error;
    }
  }, []);

  const updateHustle = useCallback(async (id: string, updates: HustleUpdate) => {
    try {
      const { data, error } = await supabase
        .from('hustles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Hustle updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating hustle:', error);
      toast.error('Failed to update hustle');
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
      toast.success('Hustle deleted successfully');
    } catch (error) {
      console.error('Error deleting hustle:', error);
      toast.error('Failed to delete hustle');
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