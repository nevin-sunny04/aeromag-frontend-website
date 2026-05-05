import { Metadata } from "next";
import Byline from "@/app/components/byline";
import RecentPosts from "@/app/components/news/singlenews/RecentPosts";
import { Category, News } from "@/app/utils/types";
import { apiRequest } from "@/lib/apiClient";

// export const dynamic = "force-dynamic";

// Metadata function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ news: string }>;
}): Promise<Metadata> {
  const slug = (await params).news;
  const Data = await apiRequest(`/news/?slug=${slug}`, {
    next: { revalidate: 3600, tags: ["news", `news-${slug}`] },
  });

  return {
    title: Data?.page_title || Data?.title,
    description: Data?.meta_description || "Aeromagasia News",
    keywords: Data?.meta_keywords || ["Aeromagasia News"],
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ news: string; category: string }>;
}) {
  const slug = (await params).news;
  const category = (await params).category;
  const [newsData, recentData, categories] = await Promise.all([
    apiRequest(`/news/?slug=${slug}`, {
      next: { revalidate: 3600, tags: ["news", `news-${slug}`] },
    }),
    apiRequest(`/news/?limit=6&category=${category}`, {
      next: { revalidate: 300, tags: ["news", "news-list", `news-category-${category}`] },
    }),
    apiRequest(`/news-category/`, { next: { revalidate: 86400, tags: ["categories"] } }),
  ]);
  // Defensive check for API errors
  const hasError =
    !newsData ||
    "error" in newsData ||
    "detail" in newsData ||
    !recentData ||
    "error" in recentData ||
    "detail" in recentData ||
    !categories ||
    "error" in categories ||
    "detail" in categories ||
    !Array.isArray(categories) ||
    !newsData.content;

  if (hasError) {
    console.error("News page data fetch failed:", {
      newsData,
      recentData,
      categories,
    });
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-600">
          The requested article could not be loaded. Please check your
          connection or try again later.
        </p>
      </div>
    );
  }

  const currentCategory = categories.find(
    (cat: Category) => cat.slug === category,
  );

  if (!currentCategory) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600">
          The requested category could not be found.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="heading  font-bold text-black dark:text-white mb-2">
        {newsData.title}
      </h1>
      <Byline
        category={newsData.category}
        author={newsData.author}
        date={newsData.publish_date}
      />
      {/*<div className="relative h-[400px]">
        <Image
          className="mt-4 object-contain"
          src={newsData.featured_img}
          alt={newsData.alt_text}
          fill
        />
      </div>*/}
      <div
        className="content text-justify space-y-4"
        dangerouslySetInnerHTML={{ __html: newsData.content }}
      ></div>

      <p className="text-center my-8 text-lg font-semibold">
        Related News from {currentCategory.name}
      </p>
      <div className="grid gap-5 lg:grid-cols-2 grid-cols-1 ">
        {recentData.results.map((item: News) => (
          <RecentPosts
            category={currentCategory}
            data={item}
            key={`recent_${item.title}`}
          />
        ))}
      </div>
    </div>
  );
}
