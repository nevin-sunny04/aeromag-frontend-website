'use client';

// biome-ignore assist/source/organizeImports: false
import { getMagazines } from '@/app/components/magazine-archive/getArchives';
import { useQuery } from '@tanstack/react-query';

interface UseMagazineAppsParams {
  year: string;
  month: string;
  page: number;
  limit?: number;
}

export function useMagazineData({ year, month, page, limit = 15 }: UseMagazineAppsParams) {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['/magazines', year, month, page, limit],
    queryFn: () => getMagazines({ year, month, page, limit }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });

  return {
    magazines: data?.results || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    isValidating: isFetching, // Map isFetching to isValidating for compatibility
  };
}
