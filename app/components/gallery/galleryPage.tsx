'use client';

import { ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Keyboard, Navigation } from 'swiper/modules';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Slide, toast } from 'react-toastify';
import { GalleryImage } from '@/app/utils/types';
import DownloadZipButton from './downloadZip';

export default function GalleryPage({ images, title }: { images: GalleryImage[]; title: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!Array.isArray(images)) return null;

  const downloadImage = async (image: GalleryImage) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/proxy-image?url=${image.image}`,
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.title || image.alt}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`${image.title || image.alt} is being downloaded.`, {
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
    } catch (error) {
      console.error(error);
      toast.error('Failed to download the image. Please try again.', {
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
    }
  };

  const shareImage = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title || image.alt,
          text: `Check out this image from ${title}: ${image.title || image.alt}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="w-full relative  ">
      {/* Header with controls */}
      <div>
        <div className="flex justify-between gap-4 flex-wrap items-center px-3">
          <div className="flex items-center flex-wrap gap-4 ">
            <h2 className=" md:text-xl font-semibold text-primary">{title}</h2>

            <div className=" text-sm font-medium bg-gray-200 px-3 py-1 rounded-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
          <DownloadZipButton
            galleryName={title}
            imageUrls={images.map((image) => image.image)}
          />
        </div>
      </div>
      <h3 className=" text-lg mt-2 mb-2 ms-3  font-medium">
        {images[currentImageIndex]?.title || images[currentImageIndex]?.alt}
      </h3>
      {/* Swiper */}
      <Swiper
        modules={[Navigation, Keyboard]}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        keyboard={{ enabled: true }}
        initialSlide={currentImageIndex}
        className="w-full"
        onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={image.id}
            className="w-full"
          >
            <div className="relative h-[400px] flex items-center justify-center">
              <Image
                src={image.image || '/placeholder.svg'}
                alt={image.alt}
                fill
                className="w-full h-full object-contain"
                priority={index === currentImageIndex}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white text-primary hover:bg-white/20 hover:text-primary cursor-pointer rounded-full p-2 transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white text-primary hover:bg-white/20 hover:text-primary cursor-pointer  rounded-full p-2 transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Controls */}
      <div className="">
        <div className="flex flex-col  items-center gap-1">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 w-full p-3 items-center gap-3">
            <Button
              size="sm"
              onClick={() => downloadImage(images[currentImageIndex])}
              className="flex w-full items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Image
            </Button>
            <Button
              size="sm"
              onClick={() => shareImage(images[currentImageIndex])}
              className="flex w-full items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
