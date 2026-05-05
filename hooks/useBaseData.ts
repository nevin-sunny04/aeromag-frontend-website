'use client';

import { apiItem, Magazine } from '@/app/utils/types';
import { getBaseData } from '@/lib/action/getBaseData';
import { useQuery } from '@tanstack/react-query';

interface BaseData {
  sidebar: {
    normal_add: apiItem[];
    carousel_add: apiItem[];
    featured_magazine: Magazine;
  };
}

export const useBaseData = (fallbackData?: BaseData['sidebar']) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['base-data'],
    queryFn: () => getBaseData(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });

  const fallbackSidebar = fallbackData ? { sidebar: fallbackData } : undefined;

  return {
    sidebar: data?.sidebar || fallbackSidebar?.sidebar,
    error,
    isLoading,
    mutate: refetch, // Maintain SWR-compatible API
  };
};
