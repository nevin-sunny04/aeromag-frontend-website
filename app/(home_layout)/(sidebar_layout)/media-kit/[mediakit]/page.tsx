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
  const Data = await apiRequest(`/mediakit/?slug=${slug}`);

  return {
    title: Data?.page_title || Data?.title,
    description: Data?.meta_description || 'Aeromagasia Mediakits',
    keywords: Data?.meta_keywords || ['Aeromagasia Mediakits'],
  };
}

export default async function Page({ params }: { params: Promise<{ mediakit: string }> }) {
  const mediakit = (await params).mediakit;
  const mediakitData = await apiRequest(`/mediakit/?slug=${mediakit}`);
  return (
    <>
      <FlipBook
        title={mediakitData.title}
        pdfUrl={`${process.env.NEXT_PUBLIC_BASE_URL}api/proxy-pdf?url=${mediakitData.pdf}`}
      />
    </>
  );
}
