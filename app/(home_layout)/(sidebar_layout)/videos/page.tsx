import ListCard from '@/app/components/news/newsCard';
import NotFoundSvg from '@/app/components/notFound';
import PaginationComponent from '@/app/components/pagination';
import { video } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

// Metadata function
export async function generateMetadata() {
  return {
    title: 'Videos',
    description: 'Aeromagasia Videos',
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { page } = await searchParams;
  const limit = 12;

  const videosData = await apiRequest(
    `/videos/?offset=${(Number(page) - 1) * limit || 0}&limit=${limit}`,
  );

  if (!videosData || 'error' in videosData || !Array.isArray(videosData.results)) {
    return (
      <div className="text-center mt-10">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
          <NotFoundSvg />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Videos found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {`We couldn't find any videos.`}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(videosData.count / limit);

  return (
    <>
      {videosData.results.length > 0 ? (
        <>
          {videosData.results.map((video: video) => (
            <ListCard
              title={video.title}
              key={`videos_${video.title}`}
              type="Videos"
              altText={video.alt_text}
              imageUrl={video.thumbnail_image}
              date={video.publish_date}
              slug={video.slug}
            />
          ))}
        </>
      ) : (
        <div className="text-center mt-10">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
            <NotFoundSvg />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Videos found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {`We couldn't find any videos.`}
          </p>
        </div>
      )}

      {videosData.count > limit && (
        <PaginationComponent
          currentPage={Number(page) || 1}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
