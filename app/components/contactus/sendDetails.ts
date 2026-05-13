'use server';

import { apiRequest } from '@/lib/apiClient';

export async function sendData(data: { [key: string]: string | number }) {
  try {
    const res = await apiRequest('contact/', { method: 'POST', body: data });
    return res;
  } catch (error) {
    return { success: false, error: 'Failed to submit. Please try again.' };
  }
}
