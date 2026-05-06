export default async function getSuggestions(query: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');
  const res = await fetch(`${baseUrl}/search/?search=${encodeURIComponent(query)}`, {
    cache: 'no-store',
  });
  if (!res.ok) return { status: 'error', results: [] };
  return res.json();
}
