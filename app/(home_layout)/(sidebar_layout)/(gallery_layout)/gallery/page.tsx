import { Gallery } from '@/app/components/gallery/gallerycards';
import NotFoundSvg from '@/app/components/notFound';
import PaginationComponent from '@/app/components/pagination';
import { GalleryItem } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const page = Number((await searchParams).page) || 1;
  const limit = 10;

  // use offset = (page - 1) * limit
  const offset = (page - 1) * limit;

  const galleryData = await apiRequest(`/gallery/?offset=${offset}&limit=${limit}`);

  const totalPages = Math.ceil(galleryData.count / limit);

  return (
    <div className="space-y-7">
      {galleryData.results.length > 0 ? (
        <>
          {galleryData.results.map((item: GalleryItem) => (
            <Gallery
              key={item.id}
              title={item.title}
              slug={item.slug}
              items={item.images}
            />
          ))}
        </>
      ) : (
        <div className="text-center mt-10">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
            <NotFoundSvg />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Galleries found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {`We couldn't find any galleries. `}
          </p>
        </div>
      )}

      {galleryData.count > limit && (
        <div className="mt-6">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
