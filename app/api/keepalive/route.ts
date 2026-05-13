import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/apiClient';

export async function GET() {
  try {
    await apiRequest('plans/', { timeoutMs: 5_000 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
