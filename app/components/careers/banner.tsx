'use client';

import Image from 'next/image';

export default function Banner({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="relative mt-10">
      <Image
        width={1920}
        height={386}
        alt="banner"
        src={imageUrl || process.env.NEXT_PUBLIC_BASE_URL + 'news1.png'}
        className="w-full h-auto object-cover max-h-[350px]"
      />
      {/* Dark overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/35 z-10" />

      {/* Centered text */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <h1 className="text-white text-4xl font-bold">Careers</h1>
      </div>
    </div>
  );
}
