function NewsCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3 border-b border-gray-200 pb-4">
      <div className="w-full h-48 bg-gray-300 rounded-md" />
      <div className="h-5 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
    </div>
  );
}

// Skeleton for Tabs content
function TabsSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="h-8 w-32 bg-gray-300 rounded" />
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="h-48 bg-gray-300 rounded"
        />
      ))}
    </div>
  );
}

// Skeleton for Events Slider
function EventsSkeleton() {
  return (
    <div className="animate-pulse flex gap-4 overflow-x-auto py-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="w-60 h-48 bg-gray-300 rounded-md flex-shrink-0"
        />
      ))}
    </div>
  );
}

// Skeleton for Advertisement
function AdSkeleton() {
  return <div className="w-full h-40 bg-gray-300 rounded-md animate-pulse my-4" />;
}

export default function HomeSkeleton() {
  return (
    <>
      {/* News Layout Skeleton */}
      <div className="flex lg:flex-row flex-col container mt-5 items-start gap-6 md:gap-4">
        <div className="lg:w-9/12 w-full flex flex-col gap-6">
          {/* Latest news skeleton */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <NewsCardSkeleton key={idx} />
            ))}
          </div>
          {/* Ad Skeleton */}
          <AdSkeleton />
          <div className="flex md:flex-row flex-col gap-6">
            {/* Filter Skeleton */}
            <div className="w-full md:w-3/12 h-48 bg-gray-300 rounded-md animate-pulse" />
            {/* News list skeleton */}
            <div className="w-full md:w-9/12 flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <NewsCardSkeleton key={idx} />
              ))}
            </div>
          </div>
          <AdSkeleton />
        </div>
        {/* Sidebar skeleton */}
        <div className="lg:w-3/12 w-full h-[600px] bg-gray-300 rounded-md animate-pulse" />
      </div>

      {/* Events Skeleton */}
      <div className="container my-5">
        <EventsSkeleton />
      </div>

      {/* Tabs Skeleton */}
      <div className="container my-8">
        <TabsSkeleton />
      </div>

      {/* Advertisement Skeleton */}
      <AdSkeleton />
    </>
  );
}
