'use client';

import { useQuery } from '@tanstack/react-query';
import { HomeApiData } from '@/app/utils/types';
import { getHomeData } from '@/lib/action/getHomeData';

export const useHomeData = (fallbackData?: HomeApiData) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['home-data'],
    queryFn: () => getHomeData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });

  return {
    data: data || fallbackData, // Use fallback only if no data yet
    error,
    isLoading,
    mutate: refetch // Maintain SWR-compatible API
  };
};
