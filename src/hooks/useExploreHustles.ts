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
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

interface FilterOptions {
  search?: string;
  tags?: string[];
  timeCommitment?: string;
  earningPotential?: string;
  category?: string;
  sortBy?: 'created_at' | 'title' | 'earning_potential';
  sortOrder?: 'asc' | 'desc';
}

const PAGE_SIZE = 12;

export function useExploreHustles(filters: FilterOptions = {}): UseExploreHustlesResult {
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchHustles = async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('hustles')
        .select('*', { count: 'exact' })
        // Only show hustles that are not from the current user (for explore page)
        .neq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      if (filters.timeCommitment) {
        query = query.eq('time_commitment', filters.timeCommitment);
      }

      if (filters.earningPotential) {
        query = query.eq('earning_potential', filters.earningPotential);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const start = (page - 1) * PAGE_SIZE;
      query = query.range(start, start + PAGE_SIZE - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      if (isLoadMore) {
        setHustles(prev => [...prev, ...(data || [])]);
      } else {
        setHustles(data || []);
      }

      setHasMore(count ? start + PAGE_SIZE < count : false);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to load hustles');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      await fetchHustles(true);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchHustles();
  }, [
    filters.search,
    filters.tags?.join(','),
    filters.timeCommitment,
    filters.earningPotential,
    filters.category,
    filters.sortBy,
    filters.sortOrder,
  ]);

  return {
    hustles,
    loading,
    error,
    refetch: () => fetchHustles(),
    hasMore,
    loadMore,
  };
}