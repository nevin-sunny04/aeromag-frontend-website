'use client';

import { ChevronLeft, ChevronRight, Download, Share2, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Keyboard, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { GalleryImage } from '@/app/utils/types';
import DownloadZipButton from './downloadZip';

interface GalleryModalProps {
  images: GalleryImage[];
  title: string;
  open?: boolean;
  onClose?: () => void;
}

export default function GalleryModal({ images, title, open = true, onClose }: GalleryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleClose = () => {
    onClose?.();
  };

  // ✅ Centralized filename resolver
  const getFilename = (image: GalleryImage) => {
    try {
      const url = new URL(image.image);
      const filename = url.pathname.split('/').pop();
      if (filename && filename.includes('.')) {
        return filename;
      }
    } catch {
      /* ignore */
    }
    return (image.title || image.alt || 'image').replace(/\s+/g, '_') + '.jpg';
  };

  const downloadImage = async (image: GalleryImage) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/proxy-image?url=${image.image}`,
      );
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const filename = getFilename(image);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${filename} is being downloaded.`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: 'light',
        transition: Slide,
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
        theme: 'light',
        transition: Slide,
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
        toast.success(`${title} gallery Url copied to clipboard.`, {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'light',
          transition: Slide,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(`${title} gallery Url copied to clipboard.`, {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'light',
          transition: Slide,
        });
      } catch (error) {
        console.error(error);
        toast.error(`Failed to copy url to clipboard.`, {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'light',
          transition: Slide,
        });
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleClose}
      >
        <DialogTitle className="text-xl hidden font-semibold">{title}</DialogTitle>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-white hover:bg-white/20 z-50"
          onClick={handleClose}
        >
          <X className="w-6 h-6" />
        </Button>

        <DialogContent className="xl:max-w-[40vw]! lg:max-w-[55vw]! md:max-w-[70vw]! overflow-hidden">
          <div className="w-full relative xl:max-w-[36vw]! lg:max-w-[50vw]! md:max-w-[63vw]! max-w-[80vw]!">
            {/* Header with controls */}
            <div className="flex justify-between gap-3 flex-wrap items-center px-3">
              <div className="flex items-center flex-wrap gap-4">
                <h2 className="text-xl font-semibold text-primary">{title}</h2>
                <div className="text-sm font-medium bg-gray-200 dark:bg-secondary px-3 py-1 rounded-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
              <DownloadZipButton
                galleryName={title}
                imageUrls={images.map((image) => image.image)}
              />
            </div>

            <h3 className="text-lg mt-2 mb-2 ms-3 font-medium">
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
                  <div className="relative md:h-[400px] h-[320px] flex items-center justify-center">
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
            <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white text-primary hover:bg-white/20 hover:text-primary cursor-pointer rounded-full p-2 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Controls */}
            <div className="flex flex-col items-center gap-1">
              <div className="grid lg:grid-cols-2 w-full p-3 items-center gap-3">
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
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
}
