'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '').replace(/\/amsapi$/, '');
    if (!apiBase) return;

    fetch(`${apiBase}/amsapi/analytics/page-view/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
