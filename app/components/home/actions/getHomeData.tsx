"use server";

"cache: no-store";

import { apiRequest } from "@/lib/apiClient";

export async function getHomeData() {
  const timestamp = Date.now();

  const url = `/home?_t=${timestamp}`; // 👈 your home endpoint

  const data = await apiRequest(url, {
    cache: "no-store",
    next: {
      revalidate: 0,
    },
  });

  // ✅ IMPORTANT: return only latest_news
  return data.latest_news || [];
}