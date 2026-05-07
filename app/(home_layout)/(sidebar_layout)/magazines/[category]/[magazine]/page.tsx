import { Metadata } from 'next';
import FlipBook from '@/app/components/flipbook';
import { Magazine } from '@/app/utils/types';
import { apiRequest } from '@/lib/apiClient';

// Helper function to extract original PDF URL
function getOriginalPdfUrl(pdfUrl: string): string {
  if (!pdfUrl) return '';

  let cleanUrl = pdfUrl;

  // Keep extracting until we get to the original URL (handles nested proxies)
  while (cleanUrl.includes('proxy-pdf?url=')) {
    const urlMatch = cleanUrl.match(/proxy-pdf\?url=([^&]+)/);
    if (urlMatch) {
      cleanUrl = decodeURIComponent(urlMatch[1]);
    } else {
      break;
    }
  }

  // Ensure we have a valid URL (should start with http/https or be a relative path)
  if (cleanUrl.startsWith('http') || cleanUrl.startsWith('/')) {
    return cleanUrl;
  }

  // Return the URL as-is if we couldn't clean it
  return pdfUrl;
}

// Metadata function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ magazine: string }>;
}): Promise<Metadata> {
  try {
    const slug = (await params).magazine;
    const data = (await apiRequest(`/magazines/?slug=${slug}`, { next: { revalidate: 3600, tags: ['magazines', `magazine-${slug}`] } })) as Magazine;

    return {
      title: data?.page_title || data?.title || 'Aeromagasia Magazine',
      description: data?.meta_description || 'Aeromagasia Magazines',
      keywords: data?.meta_keywords || 'Aeromagasia Magazines',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Aeromagasia Magazine',
      description: 'Aeromagasia Magazines',
      keywords: 'Aeromagasia Magazines',
    };
  }
}

export default async function Page({ params }: { params: Promise<{ magazine: string }> }) {
  try {
    const magazine = (await params).magazine;
    const magazineData = (await apiRequest(`/magazines/?slug=${magazine}`, { next: { revalidate: 3600, tags: ['magazines', `magazine-${magazine}`] } })) as Magazine;

    // Handle case where magazine is not found
    if (!magazineData) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">Magazine not found</p>
        </div>
      );
    }

    // Get the original PDF URL and create proper proxy URL for viewing
    const originalPdfUrl = getOriginalPdfUrl(magazineData.pdf || magazineData.pdf_file || '');

    // Only create proxy URL if we have a clean original URL
    // Use inline viewing (so browser PDF viewer works)
    const proxyPdfUrl = originalPdfUrl
      ? `/api/proxy-pdf?url=${encodeURIComponent(originalPdfUrl)}`
      : '';

    // Create separate download URL that forces download
    const downloadPdfUrl = originalPdfUrl
      ? `/api/proxy-pdf?url=${encodeURIComponent(originalPdfUrl)}&download=true`
      : '';

    // Handle case where no PDF is available
    if (!proxyPdfUrl) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">PDF not available for this magazine</p>
        </div>
      );
    }

    return (
      <>
        <FlipBook
          title={magazineData.title}
          pdfUrl={proxyPdfUrl}
          downloadUrl={downloadPdfUrl}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading magazine:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Error loading magazine. Please try again later.</p>
      </div>
    );
  }
}
