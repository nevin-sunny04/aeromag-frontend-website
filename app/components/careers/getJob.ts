'use server';

import { apiRequest } from '@/lib/apiClient';

export async function GetJob(slug: string) {
  const res = await apiRequest(`/career/${slug}`, { method: 'GET' });
  return res;
}
