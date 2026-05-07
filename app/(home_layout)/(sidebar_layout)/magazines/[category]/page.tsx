import MagazineCard from '@/app/components/magazines/magazineCard';
import NotFoundSvg from '@/app/components/notFound';
import { apiRequest } from '@/lib/apiClient';

export async function generateMetadata() {
  return {
    title: 'Magazines',
    description: 'Aeromagasia',
  };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const category = (await params).category;
  const limit = 12;
  const magazineData = await apiRequest(`/magazines/?category=${category}&limit=${limit}`, { next: { revalidate: 3600, tags: ['magazines', 'magazines-list', `magazines-category-${category}`] } });

  return (
    <div>
      {magazineData.results.length > 0 ? (
        <MagazineCard
          type="Magazines"
          initialMagazineData={magazineData.results}
          category={category}
          initialLimit={limit}
        />
      ) : (
        <div className="text-center mt-10">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full text-primary flex items-center justify-center mb-6">
            <NotFoundSvg />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Magazines found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {`We couldn't find any articles in the ${category?.toLowerCase()}. `}
          </p>
        </div>
      )}
    </div>
  );
}
