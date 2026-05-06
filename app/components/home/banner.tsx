'use client';

import { Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import Link from 'next/link';

interface BannerData {
  id: number;
  file: string;
  url: string;
}

export default function Banner({ data }: { data: BannerData[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="container banner-wrapper mt-2">
      <Swiper
        slidesPerView={1}
        className=""
        effect={'fade'}
        speed={1500}
        spaceBetween={30}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[EffectFade, Autoplay]}
      >
        {data.map((item: BannerData) => (
          <SwiperSlide
            key={`banner_${item.id}`}
            className="rounded-md overflow-hidden"
          >
            {/* <div className=" bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${item.banner_image})` }}>
              <div className="px-10 min-h-[300px] flex items-center justify-between">
                <div className="text-white md:w-5/12">
                  <h2 className="text-3xl font-medium">{item.heading}</h2>
                  <h3 className="mt-5 relative after:-top-0 after:left-[-40px] after:rounded-e-sm z-2 after:-z-1  text-[20px] font-[300] max-w-[66%] py-3 pe-3 rounded-sm after:content-[''] after:absolute after:h-[100%] after:w-[calc(100%+40px)] after:bg-primary">
                    {item.subheading}
                  </h3>
                </div>
                <div className="text-white font-[300] md:w-5/12  flex flex-col justify-end items-end h-[200px]">
                  <div>
                    <p className="mb-1">{item.title}</p>
                    <Link href={item.link}>{item.contact}</Link>
                  </div>
                </div>
              </div>
            </div> */}
            <Link
              href={item.url}
              target="_blank"
            >
              <Image
                width={1920}
                height={386}
                alt="main_ad"
                src={item.file}
                className="w-full h-auto"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
