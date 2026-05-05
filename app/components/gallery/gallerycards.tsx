'use client';

import Image from 'next/image';
import { useState } from 'react';
import { GalleryImage } from '@/app/utils/types';
import { cn } from '@/lib/utils';
import GalleryModal from './galleryModal';

interface AircraftGalleryProps {
  title: string;
  items: GalleryImage[];
  className?: string;
  slug: string;
}

export function Gallery({ title, items, className }: AircraftGalleryProps) {
  const [open, setOpen] = useState(false);
  const galItems = items.slice(0, 3);

  return (
    <div className={cn('space-y-3 group', className)}>
      <h2 className="sub-heading text-primary">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {galItems.map((item, index) => (
          <div
            key={item.id}
            className="relative flex overflow-hidden rounded-lg border border-border shadow-sm transition-all hover:shadow-md"
          >
            <Image
              src={item.image}
              alt={item.alt}
              width={409}
              height={325}
              className="object-cover"
            />

            {index === galItems.length - 1 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 md:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  onClick={() => setOpen(true)}
                  className="font-medium px-4 py-2 rounded-sm text-sm transition-all bg-white text-primary hover:scale-105 hover:bg-primary hover:text-white cursor-pointer"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Modal triggered by state */}
      {open && (
        <GalleryModal
          images={items}
          title={title}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
