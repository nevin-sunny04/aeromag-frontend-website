'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Event } from '@/app/utils/types';

export default function Events({ events }: { events: Event[] }) {
  // Create infinite slides by duplicating events if needed
  const infiniteEvents = useMemo(() => {
    if (events.length === 0) return [];
    // Always duplicate to ensure smooth looping (minimum 15 slides for 5 slidesPerView)
    const minSlides = 15;
    if (events.length < minSlides) {
      const multiplier = Math.ceil(minSlides / events.length);
      return Array(multiplier).fill(events).flat();
    }
    return events;
  }, [events]);
  return (
    <div className="md:my-2 mt-10 container">
      <div>
        <h2 className="uppercase heading text-center">Events</h2>

        <Swiper
          key={infiniteEvents.length + events.length}
          loop={true}
          initialSlide={Math.floor(infiniteEvents.length / 5)}
          centeredSlides={true}
          slideToClickedSlide={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          className="events-slider my-5 w-full"
        >
          {infiniteEvents.length !== 0 &&
            infiniteEvents.map((item, index) => (
              <SwiperSlide
                className="md:py-8"
                key={`event_${item.id}_${index}`}
              >
                <Link
                  href={item.link}
                  target="_blank"
                  className="group relative block h-[350px] w-full rounded-md overflow-hidden md:shadow-sm"
                >
                  <Image
                    src={item.featured_img}
                    alt={item.name}
                    fill
                    className="object-contain md:object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
