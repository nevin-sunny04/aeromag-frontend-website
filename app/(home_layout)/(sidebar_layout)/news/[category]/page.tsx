import ListCard from '@/app/components/news/newsCard';
import NotFoundSvg from '@/app/components/notFound';
import PaginationComponent from '@/app/components/pagination';
import { News } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

export async function generateMetadata() {
  return {
    title: 'News',
    description: 'Aeromagasia News',
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const category = (await params).category;
  const { page } = await searchParams;
  const limit = 10;

  const newsData = await apiRequest(
    `/news/?category=${category}&offset=${(Number(page) - 1) * limit || 0}&limit=${limit}`,
    { next: { revalidate: 300, tags: ['news', 'news-list', `news-category-${category}`] } },
  );
  const totalPages = Math.ceil(newsData.count / limit);

  return (
    <div>
      {newsData.results.length < 1 ? (
        <div className="text-center mt-10">
          <div className="mx-auto  w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
            <NotFoundSvg />
          </div>
          <h3 className="text-xl font-semibold mb-2">No News found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {`We couldn't find any news in the ${category?.toLowerCase()}. `}
          </p>
        </div>
      ) : (
        <>
          {newsData.results.map((news: News) => (
            <ListCard
              title={news.title}
              key={`Category_news_${news.title}`}
              content={news.content}
              altText={news.alt_text}
              categorySlug={category}
              type="news"
              imageUrl={news.featured_img}
              category={category}
              date={news.publish_date}
              slug={news.slug}
            />
          ))}
          {newsData.count > limit && (
            <PaginationComponent
              currentPage={Number(page) || 1}
              totalPages={totalPages}
            />
          )}
        </>
      )}
    </div>
  );
}
