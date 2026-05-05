'use server';

import { Newsletter } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

type Params = {
  year?: string;
  month?: string;
  page?: number;
  limit?: number;
};

export async function getNewsletters({ year, month, page = 1, limit = 15 }: Params): Promise<{
  results: Newsletter[];
  count: number;
}> {
  const queryParams = new URLSearchParams();
  const offset = (Number(page) - 1) * limit;

  if (year && year !== 'all') queryParams.append('year', year);
  if (month && month !== 'all') queryParams.append('month', month);
  queryParams.append('offset', offset.toString());
  queryParams.append('limit', limit.toString());
  const { results, count } = await apiRequest(
    `/newsletter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
  );

  return { results, count };
}
