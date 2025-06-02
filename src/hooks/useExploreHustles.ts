import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Hustle = Database['public']['Tables']['hustles']['Row'];

interface UseExploreHustlesResult {
  hustles: Hustle[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useExploreHustles(): UseExploreHustlesResult {
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHustles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hustles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHustles(data || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to load hustles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHustles();
  }, []);

  return {
    hustles,
    loading,
    error,
    refetch: fetchHustles
  };
}