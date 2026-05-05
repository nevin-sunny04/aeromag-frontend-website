'use server';

import { apiRequest } from '@/lib/apiClient';

export async function getMagazines(category: string, limit: number, offset: number) {
  const response = await apiRequest(
    `/magazines/?category=${category}&limit=${limit}&offset=${offset}`,
  );
  return response;
}
