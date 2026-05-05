import { Metadata } from 'next';
import Image from 'next/image';
import Byline from '@/app/components/byline';
import AudioPlayer from '@/app/components/Podcast/audioPlayer';
import { Podcast } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

// Metadata function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ podcast: string }>;
}): Promise<Metadata> {
  const slug = (await params).podcast;
  const Data = await apiRequest(`/podcasts/?slug=${slug}`);

  return {
    title: Data?.page_title || Data?.title,
    description: Data?.meta_description || 'Aeromagasia Podcasts',
    keywords: Data?.meta_keywords || ['Aeromagasia Podcasts'],
  };
}

export default async function Page({ params }: { params: Promise<{ podcast: string }> }) {
  const { podcast } = await params;
  const podcastData = (await apiRequest(`/podcasts/?slug=${podcast}`)) as Podcast;

  return (
    <div>
      <h1 className="heading  font-bold text-black dark:text-white mb-2">{podcastData.title}</h1>
      <Byline date={podcastData.publish_date} />
      <div className="relative h-[400px]">
        <Image
          className="my-4 w-full h-auto object-contain"
          src={podcastData.featured_img}
          alt={podcastData.alt_text}
          fill
        />
      </div>
      {podcastData.audio_file && (
        <div className="mt-10">
          <AudioPlayer
            title={podcastData.title}
            audioSrc={podcastData.audio_file}
          />
        </div>
      )}
    </div>
  );
}
