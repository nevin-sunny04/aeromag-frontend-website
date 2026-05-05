'use server';

import { apiRequest } from '@/lib/apiClient';

export async function ApplyJob(data: FormData) {
  const res = await apiRequest('career-form/', { method: 'POST', body: data });
  console.log("apply job", res);
  return res;
}
