'use server';

import { apiRequest } from '@/lib/apiClient';

export default async function getSuggestions(query: string) {
  const data = await apiRequest(`/search/?search=${encodeURIComponent(query)}`);
  return data;
}
