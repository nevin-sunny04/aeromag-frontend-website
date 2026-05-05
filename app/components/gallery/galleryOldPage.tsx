'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { GalleryItem } from '@/app/utils/types';
import BentoGallery from './bentoGallery';

export default function GalleryPage({ images }: { images: GalleryItem }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<(typeof images.images)[0] | null>(null);

  return (
    <>
      <BentoGallery
        images={images.images}
        scrollContainerRef={scrollRef}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      {selectedImage && (
        <div
          className="fixed inset-0 z-999 bg-black/70 flex justify-center items-center flex-col gap-4 pointer-events-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedImage(null);
          }}
        >
          <div className="overflow-auto relative rounded-lg">
            <Image
              src={selectedImage.image}
              alt={selectedImage.alt}
              width={0}
              height={0}
              className="h-auto w-auto rounded-lg max-w-full max-h-[80vh] object-contain"
              sizes="100vw"
            />
            <X
              className="absolute  p-1 top-5 right-5 rounded-full bg-white"
              onClick={() => setSelectedImage(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
