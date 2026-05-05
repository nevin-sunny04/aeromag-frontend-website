'use client';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Archive } from 'lucide-react';
import { Slide, toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

export default function DownloadZipButton({
  galleryName,
  imageUrls,
}: {
  galleryName: string;
  imageUrls: string[];
}) {
  const downloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder('images');

    await Promise.all(
      imageUrls.map(async (url, index) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}api/proxy-image?url=${url}`,
          );
          if (!response.ok) throw new Error('Network response was not ok');

          const blob = await response.blob();

          // Get the filename from URL or give a default name
          const name = url.split('/').pop() || `image-${index + 1}.jpg`;

          folder?.file(name, blob);
        } catch (error) {
          console.error(`Failed to fetch ${url}:`, error);
        }
      }),
    );

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${galleryName}.zip`);
    toast.success(`Downloading images from ${galleryName} gallery as ZIP.`, {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'light',
      transition: Slide,
      isLoading: false,
    });
  };

  return (
    <Button
      size="sm"
      className="flex items-center gap-2"
      variant={'outline'}
      onClick={downloadZip}
    >
      <Archive className="w-4 h-4" />
      Download All
    </Button>
  );
}
