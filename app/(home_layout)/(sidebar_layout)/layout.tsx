import Breadcrumb from '@/app/components/breadcrumbs';
import SideBar from '@/app/components/home/sideBar';
import { CategoryNav } from '@/app/components/news/categoryNav';
import { apiRequest } from '@/lib/apiClient';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [magazineCat, categories, base] = await Promise.all([
    apiRequest(`/magazines-category/`),
    apiRequest(`/news-category/`),
    apiRequest(`/base/`),
  ]);

  // Defensive check for API errors
  const hasError =
    !base ||
    'error' in base ||
    !base.sidebar ||
    !categories ||
    'error' in categories ||
    !Array.isArray(categories) ||
    !magazineCat ||
    'error' in magazineCat;

  if (hasError) {
    console.error('Sidebar layout data fetch failed:', { base, categories, magazineCat });
    // Verify if we can render children even if sidebar fails
    return (
      <div className="container relative my-5">
        <div className="flex md:flex-row flex-col items-start gap-7">
          <div className="w-full min-w-0"> {children}</div>
          {/* Sidebar omitted due to error */}
        </div>
      </div>
    );
  }

  return (
    <div className="container relative my-5">
      <div className="flex lg:flex-wrap gap-y-3 mb-5 justify-between items-center">
        <Breadcrumb />
        <CategoryNav
          category={categories}
          magazineCat={magazineCat}
        />
      </div>
      <div className="flex md:flex-row flex-col items-start gap-7">
        <div className="lg:w-9/12 xl:w-9/12 md:w-8/12 w-full min-w-0"> {children}</div>
        <SideBar data={base.sidebar} />
      </div>
    </div>
  );
}
