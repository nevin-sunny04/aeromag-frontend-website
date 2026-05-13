import { Metadata } from 'next';
import FlipBook from '@/app/components/flipbook';
import { apiRequest } from '@/lib/apiClient';

// Metadata function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ mediakit: string }>;
}): Promise<Metadata> {
  const slug = (await params).mediakit;
  const Data = await apiRequest(`/mediakit/?slug=${slug}`, { next: { revalidate: 3600, tags: ['mediakit', `mediakit-${slug}`] } });

  return {
    title: Data?.page_title || Data?.title,
    description: Data?.meta_description || 'Aeromagasia Mediakits',
    keywords: Data?.meta_keywords || ['Aeromagasia Mediakits'],
  };
}

export default async function Page({ params }: { params: Promise<{ mediakit: string }> }) {
  const mediakit = (await params).mediakit;
  const mediakitData = await apiRequest(`/mediakit/?slug=${mediakit}`, { next: { revalidate: 3600, tags: ['mediakit', `mediakit-${mediakit}`] } });
  return (
    <>
      <FlipBook
        title={mediakitData.title}
        pdfUrl={`/api/proxy-pdf?url=${encodeURIComponent(mediakitData.pdf || '')}`}
      />
    </>
  );
}
