import ArchiveGrid from '@/app/components/magazine-archive/archiveGrid';

export async function generateMetadata() {
  return {
    title: 'Magazine Archive',
    description:
      'Explore our extensive magazine archive, featuring past issues and special editions of Aeromagasia. Dive into a world of aviation insights, industry trends, and captivating stories from the skies.',
    keywords:
      'Magazine Archive, Aeromagasia Magazines, Past Issues, Aviation Insights, Industry Trends, Special Editions',
  };
}

export default async function Page() {
  return <ArchiveGrid />;
}
