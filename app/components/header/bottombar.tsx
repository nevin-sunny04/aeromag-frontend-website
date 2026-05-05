'use client';

import { Mails, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import type { Category } from '@/app/utils/types';
import getSuggestions from './getSearchFields';
import { Navbar } from './navBar';
import { Toggle } from './themetoggle';

interface SearchResult {
  type:
    | 'NewsCategory'
    | 'Interviews'
    | 'MediaKit'
    | 'News'
    | 'Magazine'
    | 'Podcasts'
    | 'Video'
    | 'NewsLetter'
    | 'Gallery';
  id: number;
  matched_fields: string[];
  name?: string; // for NewsCategory
  slug: string;
  category_slug?: string;
  category?: { slug: string }[];
  title?: string; // for Interviews/MediaKit
  publish_date?: string;
  person_name?: string; // for Interviews
  featured_img?: string;
  cover_image?: string; // for MediaKit
}

export default function BottomBar({
  category,
  magazineCat,
}: {
  category: Category[];
  magazineCat: Category[];
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const closeResults = () => {
    setShowResults(false);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setShowResults(true);

    try {
      const data = await getSuggestions(query);

      if (data.status === 'success' && Array.isArray(data.results)) {
        const normalizedQuery = query.toLowerCase();

        // Ranking logic
        const rankedResults = [...data.results].sort((a: SearchResult, b: SearchResult) => {
          const aTitle = (a.title || a.name || '').toLowerCase();
          const bTitle = (b.title || b.name || '').toLowerCase();

          const aExact = aTitle === normalizedQuery ? 1 : 0;
          const bExact = bTitle === normalizedQuery ? 1 : 0;

          if (aExact !== bExact) {
            return bExact - aExact; // Exact matches first
          }

          const aStarts = aTitle.startsWith(normalizedQuery) ? 1 : 0;
          const bStarts = bTitle.startsWith(normalizedQuery) ? 1 : 0;

          if (aStarts !== bStarts) {
            return bStarts - aStarts; // Titles starting with query next
          }

          const aIncludes = aTitle.includes(normalizedQuery) ? 1 : 0;
          const bIncludes = bTitle.includes(normalizedQuery) ? 1 : 0;

          if (aIncludes !== bIncludes) {
            return bIncludes - aIncludes; // Partial matches after that
          }

          return 0; // Keep original order if tie
        });

        setSearchResults(rankedResults);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setShowResults(false);
    setShowSearch(false);
  };

  const getResultUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'NewsCategory':
        return `/category/${result.slug}`;
      case 'Interviews':
        return `/interviews/${result.slug}`;
      case 'MediaKit':
        return `/media-kit/${result.slug}`;
      case 'Magazine':
        return `/magazines/${result.category_slug}/${result.slug}`;
      case 'News':
        return `/News/${result.category?.[0]?.slug}/${result.slug}`;
      case 'Podcasts':
        return `/podcasts/${result.slug}`;
      case 'Video':
        return `/videos/${result.slug}`;
      case 'NewsLetter':
        return `/newsletter/${result.slug}`;
      default:
        return `/${result.slug}`;
    }
  };

  const getResultImage = (result: SearchResult) => {
    return result.featured_img || result.cover_image || '/placeholder.svg?height=80&width=120';
  };

  const getResultTitle = (result: SearchResult) => {
    return result.title || result.name || 'Untitled';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const SearchResultsUI = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`${isMobile ? 'mt-4' : 'absolute top-full left-0 right-0 mt-1'} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="py-2">
          {searchResults.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={getResultUrl(result).toLowerCase()}
              className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
              onClick={() => !isMobile && clearSearch()}
            >
              <div className="flex gap-4">
                <Image
                  src={getResultImage(result) || '/placeholder.svg'}
                  alt={getResultTitle(result)}
                  width={80}
                  height={64}
                  className="w-20 h-16 object-cover rounded-md flex-shrink-0 bg-gray-100 dark:bg-gray-800"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-5">
                    {getResultTitle(result)}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {result.type === 'NewsCategory'
                        ? 'Category'
                        : result.type === 'MediaKit'
                          ? 'Media Kit'
                          : result.type}
                    </span>

                    {result.publish_date && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(result.publish_date)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : query && !isLoading ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">No results found</p>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Search Modal for smaller screens */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 xl:hidden">
          <div className="bg-white dark:bg-gray-900 px-6 py-6 rounded-lg w-[90%] max-w-md relative max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={clearSearch}
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <form
                onSubmit={handleSearchSubmit}
                className="flex"
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 rounded-lg text-sm py-3 px-4 text-black dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="ml-3 px-4 rounded-lg bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {showResults && (
              <div className="flex-1 overflow-hidden">
                <SearchResultsUI isMobile={true} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container flex items-center py-1 justify-end">
        {/* Desktop Search - Hidden on smaller screens */}
        <div className="relative flex-1 me-5 hidden xl:flex">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 rounded-lg text-sm py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white pr-12"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 rounded-md flex items-center bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <Search size={16} />
            </button>
          </form>

          {/* Desktop Search Results */}
          {showResults && <SearchResultsUI />}

          {/* Overlay to close search results when clicking outside */}
          {showResults && (
            <div
              className="fixed inset-0 z-40"
              onClick={closeResults}
            />
          )}
        </div>

        {/* Mobile Search Icon - visible only on small screens */}
        <button
          onClick={() => setShowSearch(true)}
          className="me-4 dark:text-white xl:hidden text-gray-600 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <Search size={22} />
        </button>

        <Navbar
          category={category}
          magazineCat={magazineCat}
        />

        <Link
          href="/newsletter"
          className="bg-secondary mx-2 border-secondary border-1 hover:bg-transparent dark:hover:text-white hover:text-secondary font-medium py-2 text-sm px-4 flex items-center gap-2 rounded-sm text-white transition-colors"
        >
          News Letter
          <Mails size={18} />
        </Link>

        <Toggle />
      </div>
    </>
  );
}
