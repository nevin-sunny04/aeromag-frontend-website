'use server';

import { apiRequest } from '@/lib/apiClient';

export async function sendData(data: { [key: string]: string | number }) {
  const res = await apiRequest('contact/', { method: 'POST', body: data });
  return res;
}
