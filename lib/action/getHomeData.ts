'use server';

import { apiRequest } from '@/lib/apiClient';
import { revalidatePath } from 'next/cache';

export async function getHomeData() {
  // Force revalidation of the home page to bust Next.js cache
  revalidatePath('/', 'page');

  const data = await apiRequest('home', {
    cache: 'no-store',
  });
  return data;
}
