"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import formatDate from "@/app/utils/convertDate";
import { News } from "@/app/utils/types";

export default function LatestNews({ news }: { news: News[] }) {
  console.log("🔍 latestNews - news:", news);
  if (!Array.isArray(news)) return null;

  // Generate unique key based on news items to force Swiper re-initialization
  const swiperKey = news.map((n) => n.id).join("-");

  return (
    <div className="border news-slider rounded-lg p-4 relative group">
      <Swiper
        key={swiperKey} // Force re-render when news changes
        navigation={{
          nextEl: ".news-next-button",
          prevEl: ".news-prev-button",
        }}
        slidesPerView={1}
        className="h-100"
        loop
        effect="fade"
        speed={1500}
        pagination={{
          clickable: true,
        }}
        spaceBetween={30}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay, Navigation, Pagination]}
      >
        {news.map((newsItem, index) => (
          <SwiperSlide
            key={`latestnews_${newsItem.id}`}
            className="h-100 rounded-md relative bg-[#1f2937]"
          >
            <Link
              href={`/news/${
                newsItem.categories?.length
                  ? newsItem.categories[0].slug
                  : newsItem.category?.length
                    ? newsItem.category[0].slug
                    : "general"
              }/${newsItem.slug}`}
            >
              {/* Image wrapper */}
              <div className="relative w-full flex justify-center items-center overflow-clip rounded-md p-4">
                <Image
                  src={newsItem.featured_img}
                  alt={newsItem.title}
                  width={600}
                  height={400}
                  className="h-auto w-auto max-h-[350px] max-w-full object-contain"
                  priority={index === 0}
                />
              </div>

              {/* Overlay content */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-5 rounded-b-md bg-black/40">
                <div className="sub-heading text-white relative z-20">
                  {newsItem.title}
                </div>

                <div className="mt-2 bg-primary py-2 px-3 rounded-sm w-max flex gap-4 text-white text-xs">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {formatDate(newsItem.publish_date)}
                  </span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="news-prev-button absolute left-10 top-1/2 z-20 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
        <ChevronLeft size={24} />
      </button>
      <button className="news-next-button absolute right-10 top-1/2 z-20 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
