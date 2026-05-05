'use client';

import { Printer } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { GalleryImage } from '@/app/utils/types';
import { cn } from '@/lib/utils';

const layoutMap = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
];

export default function BentoGallery({
  images,
  scrollContainerRef,
  selectedImage,
  setSelectedImage,
}: {
  images: GalleryImage[];
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  selectedImage: (typeof images)[0] | null;
  setSelectedImage: Dispatch<SetStateAction<GalleryImage | null>>;
}) {
  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current;
    if (!scrollContainer) return;

    if (selectedImage) {
      scrollContainer.style.overflow = 'hidden';
    } else {
      scrollContainer.style.overflow = 'auto';
    }

    return () => {
      if (scrollContainer) scrollContainer.style.overflow = 'auto';
    };
  }, [selectedImage, scrollContainerRef]);

  const handlePrint = (image: GalleryImage) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Image</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 100%; max-height: 100%; }
            </style>
          </head>
          <body>
            <img src="${image.image}" onload="window.print(); window.close()" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {images.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              layoutMap[index % layoutMap.length],
              'group relative overflow-hidden rounded-lg bg-muted transition-all hover:shadow-lg cursor-pointer',
            )}
            onClick={() => setSelectedImage(item)}
          >
            <div className="relative aspect-square h-full w-full">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm">Click to view larger</p>
              </div>
              <div className="absolute top-0  right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Printer
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrint(item);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
