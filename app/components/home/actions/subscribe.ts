'use server';

import { apiRequest } from '@/lib/apiClient';

export async function Subscribe(email: string) {
  const res = await apiRequest(`/subscribe-newsletter/`, { method: 'POST', body: { email } });
  return res;
}
