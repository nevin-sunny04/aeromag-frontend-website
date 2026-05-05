'use client';

import { useQuery } from '@tanstack/react-query';
import { getNewsData } from '@/app/components/home/actions/getNewsData';
import { getHomeData } from '@/app/components/home/actions/getHomeData';
import { News } from '@/app/utils/types';

export function useNewsData(category: string, fallbackData?: News[], refreshInterval?: number) {
  const isHome = !category;
  const { data, error, isLoading, isFetching } = useQuery<News[]>({
    queryKey: isHome ? ['home'] : ['/news', category],
    queryFn: () => {
      if (isHome) return getHomeData();
      return getNewsData(category);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes — news refreshes more frequently
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });

  return {
    news: data || [],
    isLoading,
    isError: error,
    isValidating: isFetching, // Map isFetching to isValidating for compatibility
  };
}
