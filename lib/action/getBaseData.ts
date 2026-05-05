'use server';

import { apiRequest } from '@/lib/apiClient';
import { revalidatePath } from 'next/cache';

export async function getBaseData() {

  // Force revalidation to bust Next.js cache
  revalidatePath('/', 'page');

  const data = await apiRequest('/base/', {
    cache: 'no-store',
  });
  return data;
}
