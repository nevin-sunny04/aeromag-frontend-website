'use server';

import { apiRequest } from '@/lib/apiClient';

export async function getQuestions() {
  const res = await apiRequest('questions');
  return res;
}
