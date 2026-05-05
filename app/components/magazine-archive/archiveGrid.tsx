'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ChangeEvent, useCallback } from 'react';
import DatePicker from '@/app/components/DatePicker';
import PaginationComponent from '@/app/components/pagination';
import { useMagazineData } from '@/hooks/useMagazineData';
import NotFoundSvg from '../notFound';

export default function ArchiveGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const year = searchParams.get('year') || '';
  const month = searchParams.get('month') || '';
  const page = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  const limit = 15;

  const { magazines: allMagazines, count, isLoading } = useMagazineData({ year, month, page, limit });

  // Client-side search filter within the server-paginated results
  const magazines = search
    ? allMagazines.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    : allMagazines;

  const totalPages = Math.ceil(count / limit);

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('year');
    params.delete('month');
    params.delete('search');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleYearChange = useCallback((newYear: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newYear && newYear !== 'all') {
      params.set('year', newYear);
    } else {
      params.delete('year');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const handleMonthChange = useCallback((newMonth: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newMonth && newMonth !== 'all') {
      params.set('month', newMonth);
    } else {
      params.delete('month');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 ml-4 pr-4 justify-between items-start md:items-end">
        <div className="w-full">
          <DatePicker
            selectedYear={year}
            selectedMonth={month}
            onYearChangeAction={handleYearChange}
            onMonthChangeAction={handleMonthChange}
            onClearAction={clearFilters}
          />
        </div>
        <div className="w-full md:w-64">
           {/* Add a search box */}
           <input
             type="text"
             placeholder="Search magazines..."
             value={search}
             onChange={handleSearchChange}
             className="w-full h-10 border-input bg-background px-3 py-2 text-[15px] border rounded-md placeholder:text-muted-foreground placeholder:text-[15px] outline-none data-focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring transition-colors"
           />
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 mt-3 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:gap-15 gap-5 p-4">
          {Array.from({ length: limit }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-white dark:bg-zinc-900 animate-pulse px-4 pt-4 shadow-sm"
            >
              <div className="w-full h-80 bg-gray-200 dark:bg-zinc-700 mb-4 rounded" />
            </div>
          ))}
        </div>
      ) : magazines && magazines.length > 0 ? (
        <div className="grid grid-cols-1 mt-3 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:gap-15 gap-5 p-4">
          {magazines.map((card, index) => (
            <div
              key={index}
              className="rounded-lg relative border border-gray-200 shadow-sm px-4 pt-4 overflow-hidden bg-white dark:bg-zinc-900 transition hover:shadow-lg"
            >
              <div className="relative w-full">
                <Image
                  src={card.cover_image}
                  alt={card.title}
                  width={960}
                  height={1244}
                  className="w-full h-auto"
                />
              </div>
              <div className="py-4 text-center">
                <Link
                  target="_blank"
                  href={`/magazines/${card.category[0]?.slug ?? ''}/${card.slug}`}
                  className="text-lg after:content-[''] after:top-0 after:absolute after:w-full after:h-full after:left-0  font-semibold text-center"
                >
                  {card.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center w-full mt-10">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
            <NotFoundSvg />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Magazines found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {`We couldn't find any articles in the applied filter.`}
          </p>
        </div>
      )}

      <div className="mt-10 px-3">
        {count > limit && !isLoading && (
          <PaginationComponent
            currentPage={page || 1}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
}
