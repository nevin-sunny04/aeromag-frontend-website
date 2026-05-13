import { NextRequest, NextResponse } from 'next/server';
import { apiRequest } from '@/lib/apiClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await apiRequest('subscribe/', {
      method: 'POST',
      body,
      timeoutMs: 60_000,
    });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
