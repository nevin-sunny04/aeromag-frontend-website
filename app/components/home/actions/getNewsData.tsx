"use server";

"cache: no-store";

import { apiRequest } from "@/lib/apiClient";

export async function getNewsData(category: string) {

  // Add timestamp to bust ALL caching layers (CDN, proxy, browser, server)
  const timestamp = Date.now();
  const url = `/news?category=${category}&limit=5&_t=${timestamp}`;

  const data = await apiRequest(url, {
    cache: "no-store", // Explicitly prevent caching
    next: {
      revalidate: 0,
    },
  });
  return data.results;
}
