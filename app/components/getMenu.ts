'use server';

import { apiRequest } from '@/lib/apiClient';

export async function getMenu() {
  const response = await apiRequest('policy-pages/');
  return response.results;
}
