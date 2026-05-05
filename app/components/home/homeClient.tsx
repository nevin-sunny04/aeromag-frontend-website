"use client";

import { useBaseData } from "@/hooks/useBaseData";
import { useHomeData } from "@/hooks/useHomeData";
import { apiItem, HomeApiData, Magazine } from "../../utils/types";
import Advertisement from "./ad";
import Events from "./events";
import HomeSkeleton from "./homeSkeleton";
import NewsLayout from "./newsLayout";
import OtherTabs from "./othertabs";

interface HomeClientProps {
  baseSidebar: {
    normal_add: apiItem[];
    carousel_add: apiItem[];
    featured_magazine: Magazine;
  };
  initialData?: HomeApiData;
}

export default function HomeClient({
  baseSidebar,
  initialData,
}: HomeClientProps) {
  const { data, isLoading } = useHomeData(initialData);
  const { sidebar } = useBaseData(baseSidebar);

  // Show skeleton only on initial load, not during background refetches
  if (!data && isLoading) return <HomeSkeleton />;

  // If we have no data at all (shouldn't happen with initialData), show skeleton
  if (!data) return <HomeSkeleton />;

  return (
    <>
      <NewsLayout
        categories={data.categories}
        latestnews={data.latest_news}
        ad={data.advertisements}
        sidebar={sidebar || baseSidebar}
      />
      <Events events={data.upcoming_events} />
      <OtherTabs tabsData={data.tabsData} ad={data.advertisements[2]} />
      <Advertisement ad={data.advertisements[3]} />
    </>
  );
}
