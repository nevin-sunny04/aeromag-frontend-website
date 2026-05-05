'use client';

import { cn } from '@/lib/utils';

type ListCardSkeletonProps = {
  hasCategory?: boolean;
  className?: string;
};

const ListCardSkeleton = ({ hasCategory = true, className }: ListCardSkeletonProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center lg:flex-row border relative p-4 gap-8 rounded-xl shadow-sm overflow-hidden mb-4',
        className,
      )}
    >
      {/* Image skeleton */}
      <div
        className={`w-full lg:w-1/3 overflow-hidden rounded-xl relative ${hasCategory ? 'h-[184px]' : 'h-[164px]'} bg-gray-300 animate-pulse`}
      />

      <div className="flex flex-col justify-between w-full lg:w-2/3">
        <div>
          {/* Category skeleton */}
          {hasCategory && <div className="h-6 w-24 bg-gray-300 rounded-md animate-pulse mb-2" />}

          {/* Title skeleton */}
          <div className="h-7 w-full bg-gray-300 rounded-md animate-pulse mb-2" />
          <div className="h-7 w-3/4 bg-gray-300 rounded-md animate-pulse mb-3" />

          {/* Date skeleton */}
          <div className="flex items-center gap-4 mb-3">
            <div className="h-4 w-32 bg-gray-300 rounded-sm animate-pulse" />
          </div>

          {/* Read more skeleton */}
          <div className="h-6 w-28 bg-gray-300 rounded-md animate-pulse mt-2" />
        </div>
      </div>
    </div>
  );
};

export default ListCardSkeleton;
