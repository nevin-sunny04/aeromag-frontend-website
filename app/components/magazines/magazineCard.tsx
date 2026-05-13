'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateSlug } from '@/app/utils/createSlug';
import type { Magazine } from '@/app/utils/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getMagazines } from './getMagazine';

interface MagazineCardProps {
  initialMagazineData: Magazine[];
  type: string;
  category: string;
  initialLimit: number;
}

export default function MagazineCard({
  initialMagazineData,
  type,
  category,
  initialLimit,
}: MagazineCardProps) {
  const [magazineData, setMagazineData] = useState<Magazine[]>(initialMagazineData);
  const [selectedMagazine, setSelectedMagazine] = useState(initialMagazineData[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialLimit);

  const searchParams = useSearchParams();
  const [content, setContent] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const showContent = searchParams.get('whatsinissue') === 'true';
    if (showContent) {
      setContent(true);
    }
  }, [searchParams]);

  const loadMoreMagazines = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await getMagazines(category, initialLimit, offset);

      if (response.results && response.results.length > 0) {
        setMagazineData((prev) => [...prev, ...response.results]);
        setOffset((prev) => prev + initialLimit);

        // Check if we've reached the end
        if (response.results.length < initialLimit) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more magazines:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [category, initialLimit, offset, isLoading, hasMore]);

  const lastMagazineElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreMagazines();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMoreMagazines],
  );

  const handleSelectOpen = () => {
    // Load more magazines when select is opened if we're near the end
    const remainingItems =
      magazineData.length - magazineData.findIndex((m) => m.id === selectedMagazine.id);
    if (remainingItems < 5 && hasMore && !isLoading) {
      loadMoreMagazines();
    }
  };

  return (
    <div>
      <div className="flex flex-col border rounded-lg p-4 shadow-sm overflow-hidden items-center lg:flex-row gap-8">
        <Link
          href={`/${CreateSlug(type)}/${category ? `${category}/` : ''}${selectedMagazine.slug}`}
          target="_blank"
          className="relative block w-full lg:w-3/12 hover:scale-95 transition-all duration-300 rounded-md overflow-hidden"
        >
          <Image
            src={selectedMagazine.cover_image || '/placeholder.svg'}
            alt={selectedMagazine.alt_text || selectedMagazine.title}
            width={960}
            height={1244}
            className="h-auto"
          />
        </Link>

        {/* Right side - Magazine info */}
        <div className="w-full lg:w-9/12">
          <h1 className="text-[26px] font-normal">{selectedMagazine.title}</h1>

          <p
            className="mb-2 text-gray-500 w-max cursor-pointer hover:text-primary"
            onClick={() => setContent(!content)}
          >
            What&apos;s in the issue
          </p>

          <Link
            href={'/subscription'}
            className="w-full font-medium mb-0 text-[17px] inline-block !text-primary md:w-auto"
          >
            Click here to subscribe
          </Link>

          <div className="space-y-2 mt-2 mb-4">
            <p className="text-gray-600 dark:text-gray-300">Select an issue to view:</p>

            <div ref={selectRef}>
              <Select
                defaultValue={selectedMagazine.title}
                onValueChange={(value) =>
                  setSelectedMagazine(
                    magazineData.find((magazine) => magazine.title === value) || magazineData[0],
                  )
                }
                onOpenChange={(open) => {
                  if (open) handleSelectOpen();
                }}
              >
                <SelectTrigger className="peer w-full border placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-sm px-4 h-[40px] text-sm focus-visible:ring-0">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="max-h-[300px]">
                  {magazineData.map((magazine, index) => {
                    const isLast = index === magazineData.length - 1;
                    return (
                      <SelectItem
                        key={magazine.id}
                        value={magazine.title}
                        ref={isLast ? lastMagazineElementRef : undefined}
                        onClick={() => setSelectedMagazine(magazine)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{magazine.title}</span>
                          {magazine.publish_date && (
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(magazine.publish_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}

                  {/* Loading indicator in dropdown */}
                  {isLoading && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2
                        className="animate-spin mr-2"
                        size={16}
                      />
                      <span className="text-sm text-gray-500">Loading more...</span>
                    </div>
                  )}

                  {/* End of results indicator */}
                  {!hasMore && magazineData.length > initialLimit && (
                    <div className="text-center py-2 text-xs text-gray-500 border-t">
                      All magazines loaded
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              target="_blank"
              href={`/${CreateSlug(type)}/${category ? `${category}/` : ''}${selectedMagazine.slug}`}
              className="bg-primary border-1 border-primary text-sm hover:text-primary hover:bg-transparent transition-all duration-300 inline-block text-white px-4 py-2 rounded-sm"
            >
              View {type.slice(0, -1)}
            </Link>

            <Link
              download={selectedMagazine.title}
              href={`/api/proxy-pdf?url=${encodeURIComponent(selectedMagazine.pdf || '')}&download=true`}
              className="bg-transparent border-1 border-primary text-sm hover:text-white hover:bg-primary transition-all duration-300 inline-block text-primary px-4 py-2 rounded-sm"
            >
              Download {type.slice(0, -1)}
            </Link>
          </div>

          <div className="flex font-medium mt-3 items-center gap-2">
            <span>or view all </span>
            <Link
              href={'/magazines/archive'}
              className="text-primary"
            >
              Back Issue Here
            </Link>
          </div>
        </div>
      </div>

      {content && (
        <div className="mt-5 space-y-3">
          <div
            className="content text-justify"
            dangerouslySetInnerHTML={{ __html: selectedMagazine.content }}
          />
        </div>
      )}
    </div>
  );
}
