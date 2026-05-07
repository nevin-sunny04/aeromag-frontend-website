import { Metadata } from 'next';
import GalleryPage from '@/app/components/gallery/galleryPage';
import { GalleryItem } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

// Metadata function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ gallery: string }>;
}): Promise<Metadata> {
  const slug = (await params).gallery;
  const galleryData = (await apiRequest(`/gallery/?slug=${slug}`, { next: { revalidate: 3600, tags: ['gallery', `gallery-${slug}`] } })) as GalleryItem;

  return {
    title: galleryData?.page_title || galleryData?.title,
    description: galleryData?.meta_description || 'Aeromagasia Galleries',
    keywords: galleryData?.meta_keywords || ['Aeromagasia Galleries'],
  };
}

export default async function Page({ params }: { params: Promise<{ gallery: string }> }) {
  const slug = (await params).gallery;
  const galleryData = (await apiRequest(`/gallery/?slug=${slug}`, { next: { revalidate: 3600, tags: ['gallery', `gallery-${slug}`] } })) as GalleryItem;

  return (
    <>
      <GalleryPage
        images={galleryData.images}
        title={galleryData.title}
      />
    </>
  );
}
