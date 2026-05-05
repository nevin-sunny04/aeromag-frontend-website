import { Metadata } from 'next';
import { apiRequest } from '@/lib/apiClient';

// Metadata function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const Data = await apiRequest(`/policy-pages/${slug}/`, { next: { revalidate: 86400, tags: ['policy', `policy-${slug}`] } });

  return {
    title: Data?.page_title || Data?.title,
    description: Data?.meta_description || 'Aeromagasia Policy',
    keywords: Data?.meta_keywords || ['Aeromagasia Policy'],
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const page = await apiRequest(`/policy-pages/${slug}`, { next: { revalidate: 86400, tags: ['policy', `policy-${slug}`] } });

  return (
    <div>
      <h1 className="heading  font-bold  dark:text-white mb-2">{page.title}</h1>

      <div
        className="content mt-5 text-justify space-y-4"
        dangerouslySetInnerHTML={{ __html: page.content }}
      ></div>
    </div>
  );
}
