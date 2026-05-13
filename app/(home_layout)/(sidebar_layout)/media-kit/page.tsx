import { Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NotFoundSvg from '@/app/components/notFound';
import PaginationComponent from '@/app/components/pagination';
import { Magazine } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

export async function generateMetadata() {
  return {
    title: 'Mediakits',
    description: 'Aeromagasia Media Kits',
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Number((await searchParams).page);
  const limit = 12;
  const mediakitData = await apiRequest(
    `/mediakit/?limit=${limit}&page=${(Number(page) - 1) * limit || 0}`,
    { next: { revalidate: 3600, tags: ['mediakit', 'mediakit-list'] } },
  );

  if (!mediakitData || 'error' in mediakitData || !Array.isArray(mediakitData.results)) {
    return (
      <div className="text-center mt-10">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
          <NotFoundSvg />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Mediakits found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {`We couldn't find any Mediakits.`}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(mediakitData.count / limit);
  return (
    <div className="space-y-8">
      {mediakitData.results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 gap-5">
          {mediakitData.results.map((kit: Magazine) => (
            <div
              key={kit.slug}
              className="group rounded-md shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-secondary"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <Link
                  href={`/media-kit/${kit.slug}`}
                  target="_blank"
                  className="block relative"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={kit.cover_image || '/placeholder.svg'}
                      alt={kit.alt_text || kit.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 p-3 gap-3">
                  <h2 className="font-semibold leading-snug line-clamp-2">{kit.title}</h2>

                  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <Link
                      href={`/media-kit/${kit.slug}`}
                      target="_blank"
                      className="flex-1 bg-primary text-white text-xs font-medium py-2 px-3 rounded-sm transition-all duration-300 flex items-center justify-center gap-1 group/btn"
                    >
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      View
                    </Link>

                    <Link
                      download={kit.title}
                      href={`/api/proxy-pdf?url=${encodeURIComponent(kit.pdf || '')}&download=true`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium py-2 px-3 rounded-sm transition-all duration-300 flex items-center justify-center gap-1 group/btn border border-gray-200"
                    >
                      <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                      PDF
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
            <NotFoundSvg />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Mediakits found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {`We couldn't find any Mediakits.`}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {mediakitData.count > limit && (
        <PaginationComponent
          currentPage={Number(page) || 1}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
