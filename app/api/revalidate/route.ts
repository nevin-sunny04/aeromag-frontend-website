import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const tag = request.nextUrl.searchParams.get('tag');

  console.log(`API REVALIDATE: tag=${tag}`);
  console.log(`API REVALIDATE: received_secret='${secret}'`);

  const validSecret = process.env.REVALIDATION_SECRET || 'aeromag-secure-revalidate-2025';

  if (secret !== validSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag parameter' }, { status: 400 });
  }

  revalidateTag(tag, {});

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
