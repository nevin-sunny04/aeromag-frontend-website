import { Metadata } from 'next';
import Image from 'next/image';
import Byline from '@/app/components/byline';
import AudioPlayer from '@/app/components/Podcast/audioPlayer';
import { Interview } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';
import { sanitizeContent } from '@/lib/sanitizeContent';

// Metadata function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ interview: string }>;
}): Promise<Metadata> {
  const slug = (await params).interview;
  const interviewData = (await apiRequest(`/interviews/?slug=${slug}`, { next: { revalidate: 3600, tags: ['interviews', `interview-${slug}`] } })) as Interview;

  return {
    title: interviewData?.page_title || interviewData?.title,
    description: interviewData?.meta_description || 'Aeromagasia Interviews',
    keywords: interviewData?.meta_keywords || ['Aeromagasia Interviews'],
  };
}

export default async function Page({ params }: { params: Promise<{ interview: string }> }) {
  const { interview } = await params;
  const interviewData = (await apiRequest(`/interviews/?slug=${interview}`, { next: { revalidate: 3600, tags: ['interviews', `interview-${interview}`] } })) as Interview;

  return (
    <div>
      <h1 className="heading font-bold dark:text-white text-black mb-2">{interviewData.title}</h1>
      <Byline date={interviewData.publish_date} />

      {/* Image + Person Info Section */}
      <div className="mt-6 flex flex-col md:flex gap-6 items-start">
        {/* Image */}
        <div className="relative w-full md:w-1/3 h-[400px]">
          <Image
            className="object-cover rounded-md"
            src={interviewData.featured_img}
            alt={interviewData.alt_text}
            fill
          />
        </div>

        {/* Person Info + Audio */}
        <div className="flex-1 w-full">
          <div className="mt-2">
            <h3 className="font-bold text-primary text-lg">{interviewData.person_name}</h3>
            <p>{interviewData.person_designation}</p>
          </div>

          <div className="mt-5">
            <AudioPlayer
              title={interviewData.title}
              audioSrc={interviewData.audio_file}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="content mt-10"
        dangerouslySetInnerHTML={{ __html: sanitizeContent(interviewData.content) }}
      ></div>
    </div>
  );
}
