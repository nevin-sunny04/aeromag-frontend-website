import ListCard from '@/app/components/news/newsCard';
import NotFoundSvg from '@/app/components/notFound';
import PaginationComponent from '@/app/components/pagination';
import { Podcast } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

// Metadata function
export async function generateMetadata() {
  return {
    title: 'Podcasts',
    description: 'Aeromagasia Podcasts',
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { page } = await searchParams;
  const limit = 10;

  const podsData = await apiRequest(
    `/podcasts/?offset=${(Number(page) - 1) * limit || 0}&limit=${limit}`,
  );
  const totalPages = Math.ceil(podsData.count / limit);

  return (
    <>
      {podsData.results.length > 0 ? (
        <>
          {podsData.results.map((podcast: Podcast) => (
            <ListCard
              title={podcast.title}
              key={`Category_news_${podcast.title}`}
              type="podcasts"
              imageUrl={podcast.featured_img}
              date={podcast.publish_date}
              slug={podcast.slug}
              altText={podcast.alt_text}
            />
          ))}
        </>
      ) : (
        <div className="text-center mt-10">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
            <NotFoundSvg />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Podcasts found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {`We couldn't find any podcasts. `}
          </p>
        </div>
      )}

      {podsData.count > limit && (
        <PaginationComponent
          currentPage={Number(page) || 1}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
