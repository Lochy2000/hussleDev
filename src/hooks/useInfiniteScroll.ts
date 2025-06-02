import { useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
}

export function useInfiniteScroll({ onLoadMore, hasMore, loading }: UseInfiniteScrollProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const handleLoadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await onLoadMore();
    }
  }, [onLoadMore, loading, hasMore]);

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView, handleLoadMore]);

  return { ref };
}