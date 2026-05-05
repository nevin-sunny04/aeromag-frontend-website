'use server';

import { Magazine } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

type Params = {
  year?: string;
  month?: string;
  page?: number;
  limit?: number;
};

export async function getMagazines({ year, month, page = 0, limit = 15 }: Params): Promise<{
  results: Magazine[];
  count: number;
}> {
  const queryParams = new URLSearchParams();

  if (year && year !== 'all') queryParams.append('year', year);
  if (month && month !== 'all') queryParams.append('month', month);
  queryParams.append('offset', ((Number(page) - 1) * limit).toString());
  queryParams.append('limit', limit.toString());

  const { results, count } = await apiRequest(
    `/magazines${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
  );

  return { results, count };
}
