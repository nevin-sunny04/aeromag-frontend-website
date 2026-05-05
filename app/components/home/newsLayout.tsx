"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ad, apiItem, Magazine, News } from "@/app/utils/types";
import { Button } from "@/components/ui/button";
import { useNewsData } from "@/hooks/useNewsData";
import ListCardSkeleton from "../ListCardSkeleton";
import ListCard from "../news/newsCard";
import NotFoundSvg from "../notFound";
import Advertisement from "./ad";
import Filter from "./filterBox";
import LatestNews from "./latestNews";
import SideBar from "./sideBar";

export default function NewsLayout({
  categories,
  ad,
  sidebar,
  latestnews,
}: {
  categories: { id: number; name: string; slug: string }[];
  ad: ad[];
  sidebar: {
    normal_add: apiItem[];
    carousel_add: apiItem[];
    featured_magazine: Magazine;
  };
  latestnews: News[];
}) {
  const [category, setCategory] = useState(categories[0]?.slug);

  // Don't use fallback data to ensure fresh content
  const { news, isLoading } = useNewsData(category);

  // Fetch latest news for the slider - no fallback to force fresh data
  const { news: sliderNews } = useNewsData("");

  // Use latestnews prop as fallback for initial render, then use fresh data
  const displaySliderNews = sliderNews.length > 0 ? sliderNews : latestnews;

  // DEBUG: Log what's being displayed
  console.log("🔍 newsLayout - sliderNews:", sliderNews);
  console.log("🔍 newsLayout - latestnews (prop):", latestnews);
  console.log("🔍 newsLayout - displaySliderNews:", displaySliderNews);

  return (
    <div className="flex lg:flex-row flex-col container mt-5  items-start gap-6 md:gap-4">
      <div className="lg:w-9/12 w-full">
        <LatestNews news={displaySliderNews} />
        {ad?.length > 0 && ad[0]?.image && (
        <Link className="my-4 block" href={ad[0].link || "/"} target="_blank">
          <Image
            src={ad[0].image}
            alt="advertisement"
            width={1500}
            height={300}
            className="w-full h-auto rounded-md"
          />
        </Link>
       
	)}
        <div
          className="flex md:flex-row flex-col
          gap-6 items-start"
        >
          <Filter
            categories={categories}
            selectedCategory={category}
            setSelectedCategory={setCategory}
          />

          <div className="w-full xl:w-9/12 lg:w-8/12 md:w-9/12 flex flex-col gap-3">
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <ListCardSkeleton key={index} hasCategory={true} />
                ))}
              </>
            ) : news.length > 0 ? (
              <>
                {news.map((item) => (
                  <ListCard
                    key={`news_${item.id}`}
                    title={item.title}
                    content={item.content}
                    imageUrl={item.featured_img}
                    date={item.publish_date}
                    type="news"
                    altText={item.title}
                    category={category}
                    categorySlug={category}
                    slug={item.slug}
                  />
                ))}
                <Link
                  href={`/news/${category}`}
                  className="mt-3 block w-max m-auto px-5 rounded-sm bg-primary text-white py-1 font-medium hover:bg-red-600 transition"
                >
                  View All
                </Link>
              </>
            ) : (
              <div className="text-center mt-5">
                <div className="mx-auto  w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
                  <NotFoundSvg />
                </div>
                <h3 className="text-xl font-semibold mb-2">No news found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {`We couldn't find any articles in the ${category?.toLowerCase()} category. `}
                </p>
                <Button
                  onClick={() => setCategory("")}
                  className="mb-8 cursor-pointer"
                >
                  View All News
                </Button>
              </div>
            )}
          </div>
        </div>
        <Advertisement ad={ad[1]} />
      </div>
      <SideBar data={sidebar} />
    </div>
  );
}
