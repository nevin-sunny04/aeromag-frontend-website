import { apiRequest } from '@/lib/apiClient';

async function getData() {
  const res = await apiRequest('about-us', { next: { revalidate: 86400, tags: ['about-us'] } });
  return res;
}

export async function generateMetadata() {
  const data = await getData();

  return {
    title: data?.page_title || 'About Us',
    description: data?.meta_description || 'About Aeromagasia',
    keywords: data?.meta_keyword || 'About Aeromagasia, Aeromagasia, About Us',
  };
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="space-y-3">
      <h1 className="heading font-bold text-primary">About Us</h1>
      <div
        dangerouslySetInnerHTML={{ __html: data.content }}
        className="space-y-6 content"
      />
    </div>
  );
}
