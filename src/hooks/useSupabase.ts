import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Hustle = Database['public']['Tables']['hustles']['Row'];

export function useSupabase() {
  const getHustles = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('hustles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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