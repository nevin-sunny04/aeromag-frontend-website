import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const validSecret = process.env.REVALIDATION_SECRET || 'aeromag-secure-revalidate-2025';

  if (secret !== validSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // Accept either ?tag= (single tag, backward-compatible) or JSON body { tags: string[] }
  const queryTag = request.nextUrl.searchParams.get('tag');
  let tags: string[] = [];

  if (queryTag) {
    tags = [queryTag];
  } else {
    try {
      const body = await request.json();
      if (Array.isArray(body.tags)) {
        tags = body.tags.filter((t: unknown): t is string => typeof t === 'string' && t.trim() !== '');
      }
    } catch {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
  }

  if (tags.length === 0) {
    return NextResponse.json({ message: 'No tags provided' }, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag, {});
  }

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
