import { Metadata } from 'next';
import { Suspense } from 'react';
import Byline from '@/app/components/byline';
import VideoComponent from '@/app/components/videos/getVideo';
import { video } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

// Metadata function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ video: string }>;
}): Promise<Metadata> {
  const slug = (await params).video;
  const Data = await apiRequest(`/videos/?slug=${slug}`);

  return {
    title: Data?.page_title || Data?.title,
    description: Data?.meta_description || 'Aeromagasia Videos',
    keywords: Data?.meta_keywords || ['Aeromagasia Videos'],
  };
}

export default async function Page({ params }: { params: Promise<{ video: string }> }) {
  const slug = (await params).video;
  const video = (await apiRequest(`/videos/?slug=${slug}`)) as video;

  return (
    <div>
      <h1 className="heading  font-bold text-black dark:text-white mb-2">{video.title}</h1>
      <Byline date={video.publish_date} />
      <Suspense fallback={<div className="w-full h-[400px] bg-gray-200 animate-pulse" />}>
        <VideoComponent src={video.video_url} />
      </Suspense>
    </div>
  );
}
