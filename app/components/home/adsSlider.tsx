'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { apiItem } from '@/app/utils/types';

export default function AdsSlider({ ads }: { ads: apiItem[] }) {
  if (!ads || ads.length === 0) return null;

  return (
    <div className="w-full relative group">
      <Swiper
        slidesPerView={1}
        className="w-full magslider"
        speed={1500}
        spaceBetween={30}
        navigation={{
          nextEl: '.ads-next-button',
          prevEl: '.ads-prev-button',
        }}
        loop={ads.length > 1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay, Navigation]}
      >
        {ads.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="w-full"
          >
            <div className="cursor-pointer">
              <Link
                href={slide.url}
                className="block w-full"
                target="_blank"
              >
                <Image
                  src={slide.file}
                  alt="Advertisements"
                  width={296}
                  height={343}
                  unoptimized
                  className="h-auto w-full rounded-lg"
                />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {ads.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex shadow-md rounded-sm overflow-hidden">
          <button className="ads-prev-button bg-primary hover:bg-primary/90 text-white w-8 h-8 flex items-center justify-center transition-all disabled:opacity-50">
            <ChevronLeft size={20} />
          </button>
          <button className="ads-next-button bg-white hover:bg-gray-100 text-primary w-8 h-8 flex items-center justify-center transition-all disabled:opacity-50">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
