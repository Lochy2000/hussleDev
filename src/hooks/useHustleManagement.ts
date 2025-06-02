import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Hustle = Database['public']['Tables']['hustles']['Row'];
type HustleInsert = Database['public']['Tables']['hustles']['Insert'];
type HustleUpdate = Database['public']['Tables']['hustles']['Update'];

interface UseHustleManagementResult {
  loading: boolean;
  error: Error | null;
  createHustle: (hustle: Omit<HustleInsert, 'user_id'>) => Promise<Hustle>;
  updateHustle: (id: string, updates: HustleUpdate) => Promise<Hustle>;
  deleteHustle: (id: string) => Promise<void>;
  getHustle: (id: string) => Promise<Hustle>;
  getUserHustles: (userId: string) => Promise<Hustle[]>;
}

export function useHustleManagement(): UseHustleManagementResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createHustle = useCallback(async (hustle: Omit<HustleInsert, 'user_id'>): Promise<Hustle> => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('hustles')
        .insert({
          ...hustle,
          user_id: userData.user.id,
          status: 'saved',
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      toast.success('Hustle created successfully');
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to create hustle');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHustle = useCallback(async (id: string, updates: HustleUpdate): Promise<Hustle> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hustles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      toast.success('Hustle updated successfully');
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to update hustle');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteHustle = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('hustles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Hustle deleted successfully');
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to delete hustle');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHustle = useCallback(async (id: string): Promise<Hustle> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hustles')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Hustle not found');

      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to fetch hustle');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserHustles = useCallback(async (userId: string): Promise<Hustle[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hustles')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to fetch hustles');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createHustle,
    updateHustle,
    deleteHustle,
    getHustle,
    getUserHustles,
  };
}