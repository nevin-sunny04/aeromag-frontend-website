import ListCard from '@/app/components/news/newsCard';
import NotFoundSvg from '@/app/components/notFound';
import PaginationComponent from '@/app/components/pagination';
import { Interview } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

// Metadata function
export async function generateMetadata() {
  return {
    title: 'Interviews',
    description: 'Aeromagasia Interviews',
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { page } = await searchParams;
  const limit = 6;

  const interviewData = await apiRequest(
    `/interviews/?offset=${(Number(page) - 1) * limit || 0}&limit=${limit}`,
    { next: { revalidate: 3600, tags: ['interviews', 'interviews-list'] } },
  );

  if (!interviewData || 'error' in interviewData || !Array.isArray(interviewData.results)) {
    return (
      <div className="text-center mt-10">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
          <NotFoundSvg />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Interviews found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {`We couldn't find any interviews. `}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(interviewData.count / limit);

  return (
    <>
      {interviewData.results.length > 0 ? (
        <>
          {interviewData.results.map((interview: Interview) => (
            <ListCard
              title={interview.title}
              key={`Category_news_${interview.title}`}
              type="interviews"
              imageUrl={interview.featured_img}
              date={interview.publish_date}
              slug={interview.slug}
              altText={interview.alt_text}
            />
          ))}
        </>
      ) : (
        <div className="text-center mt-10">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
            <NotFoundSvg />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Interviews found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {`We couldn't find any interviews. `}
          </p>
        </div>
      )}

      {interviewData.count > limit && (
        <PaginationComponent
          currentPage={Number(page) || 1}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
