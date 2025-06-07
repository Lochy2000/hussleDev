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

      console.log('🔍 Fetching hustles with filters:', filters);
      console.log('📄 Page:', page, 'Load more:', isLoadMore);

      let query = supabase
        .from('hustles')
        .select('*', { count: 'exact' });

      console.log('🔧 Building query...');

      // Only show system hustles (sample data) and exclude user-created hustles
      // System hustles have user_id = '00000000-0000-0000-0000-000000000000'
      // OR hustles that don't have "Created by user" in their notes
      query = query.or(`user_id.eq.00000000-0000-0000-0000-000000000000,and(notes.not.ilike.*Created by user*,notes.not.ilike.*Saved from explore page*)`);

      // Apply filters
      if (filters.search) {
        console.log('🔍 Adding search filter:', filters.search);
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.tags && filters.tags.length > 0) {
        console.log('🏷️ Adding tags filter:', filters.tags);
        query = query.contains('tags', filters.tags);
      }

      if (filters.timeCommitment) {
        console.log('⏰ Adding time commitment filter:', filters.timeCommitment);
        query = query.eq('time_commitment', filters.timeCommitment);
      }

      if (filters.earningPotential) {
        console.log('💰 Adding earning potential filter:', filters.earningPotential);
        query = query.eq('earning_potential', filters.earningPotential);
      }

      if (filters.category) {
        console.log('📂 Adding category filter:', filters.category);
        query = query.eq('category', filters.category);
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      console.log('📊 Sorting by:', sortBy, sortOrder);
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const start = (page - 1) * PAGE_SIZE;
      console.log('📄 Pagination - start:', start, 'end:', start + PAGE_SIZE - 1);
      query = query.range(start, start + PAGE_SIZE - 1);

      console.log('🚀 Executing query...');
      const { data, error, count } = await query;

      console.log('📊 Query results:');
      console.log('  - Data count:', data?.length || 0);
      console.log('  - Total count:', count);
      console.log('  - Error:', error);
      console.log('  - Sample data:', data?.slice(0, 2));

      if (error) {
        console.error('❌ Query error:', error);
        throw error;
      }

      if (isLoadMore) {
        console.log('➕ Appending to existing hustles');
        setHustles(prev => [...prev, ...(data || [])]);
      } else {
        console.log('🔄 Replacing hustles');
        setHustles(data || []);
      }

      setHasMore(count ? start + PAGE_SIZE < count : false);
      console.log('📄 Has more pages:', count ? start + PAGE_SIZE < count : false);
    } catch (err) {
      const error = err as Error;
      console.error('💥 Fetch error:', error);
      setError(error);
      toast.error('Failed to load hustles');
    } finally {
      setLoading(false);
      console.log('✅ Fetch complete');
    }
  };

  const loadMore = async () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      await fetchHustles(true);
    }
  };

  const refetch = async () => {
    console.log('🔄 Refetching hustles...');
    setPage(1);
    setHustles([]);
    await fetchHustles();
  };

  useEffect(() => {
    console.log('🔄 Filters changed, resetting and fetching...');
    setPage(1);
    setHustles([]); // Clear existing hustles when filters change
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
    refetch,
    hasMore,
    loadMore,
  };
}