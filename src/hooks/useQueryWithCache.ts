import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface UseQueryWithCacheOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  key: string[];
  fn: () => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
}

export function useQueryWithCache<T>({
  key,
  fn,
  staleTime = 1000 * 60 * 5, // 5 minutes
  cacheTime = 1000 * 60 * 30, // 30 minutes
  ...options
}: UseQueryWithCacheOptions<T>) {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    staleTime,
    cacheTime,
    ...options,
  });
}