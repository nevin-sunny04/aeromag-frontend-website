'use client';

import DatePicker from '@/app/components/DatePicker';
import PaginationComponent from '@/app/components/pagination';
import { Newsletter } from '@/app/utils/types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import NotFoundSvg from '../notFound';
import { getNewsletters } from './getnewsletters';

export default function NewsletterGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [year, setYear] = useState(searchParams.get('year') || '');
  const [month, setMonth] = useState(searchParams.get('month') || '');
  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const [allNewsletters, setAllNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  const limit = 15;

  // Sync state when URL changes
  useEffect(() => {
    setYear(searchParams.get('year') || '');
    setMonth(searchParams.get('month') || '');
    setPage(Number(searchParams.get('page') || '1'));
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch all newsletters once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { results } = await getNewsletters({ limit: 1000, page: 1 });
        setAllNewsletters(results || []);
      } catch (error) {
        console.error('Failed to fetch newsletters:', error);
        setAllNewsletters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredNewsletters = useMemo(() => {
    return allNewsletters.filter((item) => {
      const date = new Date(item.publish_date);
      const itemYear = date.getFullYear().toString();
      const itemMonth = (date.getMonth() + 1).toString().padStart(2, '0');

      const matchYear = !year || year === 'all' || itemYear === year;
      const matchMonth = !month || month === 'all' || itemMonth === month;
      const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());

      return matchYear && matchMonth && matchSearch;
    });
  }, [allNewsletters, year, month, search]);

  const count = filteredNewsletters.length;
  const totalPages = Math.ceil(count / limit);
  const paginatedNewsletters = filteredNewsletters.slice((page - 1) * limit, page * limit);

  // Group newsletters by month-year
  const groupedNewsletters = useMemo(() => {
    if (!paginatedNewsletters?.length) return {};
    return paginatedNewsletters.reduce((acc: Record<string, Newsletter[]>, item) => {
      const date = new Date(item.publish_date);
      const key = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date);
      (acc[key] ||= []).push(item);
      return acc;
    }, {});
  }, [paginatedNewsletters]);

  const handleYearChange = (newYear: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newYear && newYear !== 'all') {
      params.set('year', newYear);
    } else {
      params.delete('year');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleMonthChange = (newMonth: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newMonth && newMonth !== 'all') {
      params.set('month', newMonth);
    } else {
      params.delete('month');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('year');
    params.delete('month');
    params.delete('search');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Skeleton Loader
  const Loader = () => (
    <div className="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-3 xl:gap-10 gap-5 p-4">
      {Array.from({ length: limit }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse bg-muted rounded h-80"
        />
      ))}
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <div className="text-center mt-10">
      <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
        <NotFoundSvg />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Newsletters found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {`We couldn't find any newsletters.`}
      </p>
    </div>
  );

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 ml-4 pr-4 justify-between items-start md:items-end">
        <div className="w-full">
          <DatePicker
            selectedYear={year}
            selectedMonth={month}
            onYearChangeAction={handleYearChange}
            onMonthChangeAction={handleMonthChange}
            onClearAction={clearFilters}
            startYear={2025}
          />
        </div>

      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 mt-3 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 gap-5 p-4">
          {Object.entries(groupedNewsletters).map(([monthYear, items]) => (
          <div
            key={monthYear}
            className="col-span-full"
          >
            <h2 className="text-xl text-primary font-medium my-3">
              {monthYear ===
              new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(
                new Date(),
              )
                ? 'Recent'
                : monthYear}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((card, index) => (
                <div
                  key={index}
                  className="overflow-hidden shadow-md group rounded-sm"
                >
                  <div className="relative w-full">
                    <Link
                      target="_blank"
                      href={card.url || process.env.NEXT_PUBLIC_BASE_URL || '/'}
                    >
                      <Image
                        src={card.featured_img}
                        alt={card.title}
                        width={290}
                        height={290}
                        className="w-full group-hover:scale-110 cursor-pointer transition-all duration-300 h-auto max-h-[400px] object-cover object-top"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Pagination */}
      {count > limit && (
        <div className="mt-2 px-3">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  );
}
