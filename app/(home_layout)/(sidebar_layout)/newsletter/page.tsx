import { Suspense } from 'react';
import NewsletterGrid from '@/app/components/newsletter/newsCard';

// Metadata function
export async function generateMetadata() {
  return {
    title: 'Newsletter',
    description: 'About Newsletter',
  };
}

export default async function Page() {
  return (
    <Suspense>
      <NewsletterGrid />
    </Suspense>
  );
}
