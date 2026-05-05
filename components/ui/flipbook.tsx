'use client';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Menu,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type React from 'react';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import Link from 'next/link';

pdfjs.GlobalWorkerOptions.workerSrc = process.env.NEXT_PUBLIC_BASE_URL + 'pdf.worker.mjs';

type Props = {
  title: string;
  pdfUrl: string;
  downloadUrl?: string; // Add optional download URL prop
};

const PDFFlipbook: React.FC<Props> = ({ title, pdfUrl, downloadUrl }) => {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const flipBookRef = useRef<ComponentRef<typeof HTMLFlipBook> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState({ x: 0, y: 0 });
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);
  const [isManualJump, setIsManualJump] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bookSize, setBookSize] = useState({ width: 400, height: 565.71 });
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const containerHeight = containerRef.current?.offsetHeight || 0;
      const isMobileDevice = window.innerWidth < 768;
      const isLandscapeMode = isMobileDevice && window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscapeMode);
      setIsMobile(isMobileDevice);

      if (isMobileDevice) {
        if (isLandscapeMode) {
          const maxHeight = containerHeight * 0.85;
          const maxWidth = containerWidth * 0.7;
          const heightBasedWidth = maxHeight * (210 / 297); // A4 ratio (landscape)
          const width = Math.min(maxWidth, heightBasedWidth);
          const height = width * (297 / 210);
          setBookSize({ width, height });
        } else {
          const width = Math.min(containerWidth * 0.95, 400);
          const height = width * (297 / 210); // A4 ratio
          setBookSize({ width, height });
        }
      } else {
        // Desktop: original sizing
        const width = containerWidth * 0.35;
        const height = width * (297 / 210);
        setBookSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateSize, 100); // Small delay to ensure dimensions are updated
    });
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  const handleMobileNext = () => {
    if (mobileCurrentPage < numPages - 1) {
      setMobileCurrentPage((prev) => prev + 1);
    }
  };

  const handleMobilePrev = () => {
    if (mobileCurrentPage > 0) {
      setMobileCurrentPage((prev) => prev - 1);
    }
  };

  // pagination
  const handleNext = () => {
    if (isMobile) {
      handleMobileNext();
    } else {
      flipBookRef.current?.pageFlip().flipNext();
    }
  };

  const handlePrev = () => {
    if (isMobile) {
      handleMobilePrev();
    } else {
      flipBookRef.current?.pageFlip().flipPrev();
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.6));

  // full screen
  const goFullScreen = () => {
    if (!document.fullscreenElement) {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // drag book
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return; // No pan when not zoomed
    setIsDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom === 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    setPosition({ x: touch.clientX - start.x, y: touch.clientY - start.y });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // reset
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const flipSound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    flipSound.current = new Audio(`${process.env.NEXT_PUBLIC_BASE_URL}pageflip.mp3`);
  }, []);

  const handlePageFlip = (page: number) => {
    if (!isManualJump) {
      setCurrentPage(page);
    }
    setIsManualJump(false); // Reset the flag
    if (page !== currentPage && flipSound.current) {
      flipSound.current.currentTime = 0;
      flipSound.current.play();
    }
  };

  // Jump to specific page
  const jumpToPage = (pageIndex: number) => {
    if (isMobile) {
      setMobileCurrentPage(pageIndex);
    } else {
      setIsManualJump(true);
      setCurrentPage(pageIndex);
      flipBookRef.current?.pageFlip().turnToPage(pageIndex);
    }
    // Close thumbnails on mobile after selection
    if (window.innerWidth < 768) {
      setShowThumbnails(false);
    }
  };

  // Scroll thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const targetPage = isMobile ? mobileCurrentPage : currentPage;
      const thumbnail = thumbnailsRef.current.children[targetPage] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentPage, mobileCurrentPage, isMobile]);

  // Create proper download URL - use downloadUrl prop if provided, otherwise add download=true to current pdfUrl
  const getDownloadUrl = () => {
    if (downloadUrl) {
      return downloadUrl;
    }

    // If pdfUrl is already a proxy URL, add download=true parameter
    if (pdfUrl.includes('proxy-pdf')) {
      return pdfUrl.includes('?') ? `${pdfUrl}&download=true` : `${pdfUrl}?download=true`;
    }

    // If it's a direct URL, wrap it in proxy with download=true
    return `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}&download=true`;
  };

  return (
    <div className="w-screen fixed top-0 left-0 inset-0 z-1 h-screen bg-black text-white overflow-hidden flex">
      {/* Toolbar */}
      <div
        className={`absolute top-2 ${isLandscape ? 'top-1' : 'top-4'} w-[95%] md:w-auto left-1/2 -translate-x-1/2 flex gap-1 ${isLandscape ? 'gap-1' : 'gap-5'} md:gap-4 items-center bg-gray-800/80 px-2 md:px-4 md:py-1 py-3 justify-center ${isLandscape ? 'py-1' : 'py-2'} md:py-2 rounded-lg z-10 backdrop-blur-sm`}
      >
        {/* Mobile thumbnails toggle */}
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          className="md:hidden hover:scale-110 transition"
        >
          {showThumbnails ? (
            <X size={isLandscape ? 16 : 18} />
          ) : (
            <Menu size={isLandscape ? 16 : 18} />
          )}
        </button>

        <button
          onClick={handlePrev}
          className="hover:scale-110 transition"
        >
          <ChevronLeft
            size={isLandscape ? 16 : 18}
            className="md:w-5 md:h-5"
          />
        </button>
        <span className={`${isLandscape ? 'text-xs' : 'text-xs'} md:text-sm whitespace-nowrap`}>
          {isMobile ? mobileCurrentPage + 1 : currentPage + 1} / {numPages}
        </span>
        <button
          onClick={handleNext}
          className="hover:scale-110 transition"
        >
          <ChevronRight
            size={isLandscape ? 16 : 18}
            className="md:w-5 md:h-5"
          />
        </button>

        <div className={` flex  xs:flex gap-1 ${isLandscape ? 'gap-1' : 'gap-5'} md:gap-4`}>
          <button
            onClick={handleZoomOut}
            className="hover:scale-110 transition"
          >
            <ZoomOut
              size={isLandscape ? 16 : 18}
              className="md:w-5 md:h-5"
            />
          </button>
          <button
            onClick={handleZoomIn}
            className="hover:scale-110 transition"
          >
            <ZoomIn
              size={isLandscape ? 16 : 18}
              className="md:w-5 md:h-5"
            />
          </button>
          <button
            onClick={handleReset}
            className="hover:scale-110 transition"
          >
            <RotateCcw
              size={isLandscape ? 16 : 18}
              className="md:w-5 md:h-5"
            />
          </button>
        </div>

        <button
          onClick={goFullScreen}
          className="hover:scale-110 transition"
        >
          <Maximize2
            size={isLandscape ? 16 : 18}
            className="md:w-5 md:h-5"
          />
        </button>

        {/* Fixed download link */}
        <Link
          download={title}
          href={getDownloadUrl()}
          className="hover:scale-110 transition"
        >
          <Download
            size={isLandscape ? 16 : 18}
            className="md:w-5 md:h-5"
          />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className={`flex w-full h-full ${isLandscape ? 'pt-10' : 'pt-16'} md:pt-16`}>
        {/* Left Side - Flipbook or Single Page */}
        <div
          className={`flex ${showThumbnails ? (isLandscape ? 'w-4/5' : 'w-3/5') : 'w-full'} md:w-10/12 h-full justify-center items-center overflow-hidden transition-all duration-300 relative`}
          onMouseDown={handleMouseDown}
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {isMobile && (
            <>
              {/* Left navigation button */}
              <button
                onClick={handlePrev}
                disabled={mobileCurrentPage === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 disabled:bg-black/20 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Right navigation button */}
              <button
                onClick={handleNext}
                disabled={mobileCurrentPage === numPages - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 disabled:bg-black/20 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s ease',
            }}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
              onLoadError={(error) => console.error('Error loading PDF:', error)}
            >
              {isMobile ? (
                // Mobile: Single page view
                <div className="shadow-[8px_0px_20px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden">
                  <Page
                    pageNumber={mobileCurrentPage + 1}
                    width={bookSize.width}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ) : (
                // Desktop: Flipbook view
                <HTMLFlipBook
                  ref={flipBookRef}
                  width={bookSize.width}
                  height={bookSize.height}
                  size="fixed"
                  minWidth={315}
                  maxWidth={3000}
                  minHeight={400}
                  maxHeight={3536}
                  showCover={true}
                  mobileScrollSupport={true}
                  useMouseEvents={zoom === 1}
                  className="pdf-flipbook bg-transparent"
                  startPage={currentPage}
                  drawShadow={true}
                  onFlip={(e) => handlePageFlip(e.data)}
                  flippingTime={1000}
                  usePortrait={false}
                  clickEventForward={true}
                  swipeDistance={30}
                  disableFlipByClick={false}
                  style={{}}
                  startZIndex={0}
                  autoSize={true}
                  maxShadowOpacity={0.5}
                  showPageCorners={true}
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <div
                      key={`page-${index}`}
                      className="page shadow-[8px_0px_20px_rgba(0,0,0,0.5)]"
                    >
                      <Page
                        pageNumber={index + 1}
                        width={bookSize.width}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  ))}
                </HTMLFlipBook>
              )}
            </Document>
          </div>
        </div>

        {/* Right Side - Page Thumbnails */}
        <div
          className={`
          ${showThumbnails ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0
          fixed md:relative
          right-0 md:right-auto
          ${isLandscape ? 'top-10' : 'top-16'} md:top-0
          ${showThumbnails ? (isLandscape ? 'w-1/5' : 'w-2/5') : 'w-0'}
          md:w-2/12
          ${isLandscape ? 'h-[calc(100vh-2.5rem)]' : 'h-[calc(100vh-4rem)]'} md:h-full
          bg-gray-900/95 md:bg-gray-900/90
          backdrop-blur-sm
          border-l border-gray-700
          flex flex-col
          transition-all duration-300 ease-in-out
          z-20 md:z-auto
        `}
        >
          <div className={`${isLandscape ? 'p-2' : 'p-3'} md:p-4 border-b border-gray-700`}>
            <h3 className="text-xs md:text-sm font-medium text-gray-300">Pages</h3>
          </div>
          <div
            ref={thumbnailsRef}
            className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 ${isLandscape ? 'p-1 space-y-1' : 'p-1 space-y-1'} md:p-2 md:space-y-2`}
          >
            <Document
              file={pdfUrl}
              className={`${isLandscape ? 'space-y-1' : 'space-y-2'} md:space-y-5`}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={`thumbnail-${index}`}
                  className={`relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-2 ${
                    (isMobile ? mobileCurrentPage : currentPage) === index
                      ? 'border-primary shadow-lg shadow-blue-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => jumpToPage(index)}
                >
                  <div className="bg-white">
                    <Page
                      pageNumber={index + 1}
                      width={window.innerWidth < 768 ? (isLandscape ? 80 : 120) : 240}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                  {/* Page Number Overlay */}
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 md:px-2 py-1 rounded">
                    {index + 1}
                  </div>
                  {/* Current Page Indicator */}
                  {(isMobile ? mobileCurrentPage : currentPage) === index && (
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                      <div
                        className={`bg-primary text-white text-xs px-1 md:px-2 py-1 rounded-full font-medium ${isLandscape ? 'text-xs' : ''}`}
                      >
                        Current
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Document>
          </div>
        </div>
      </div>

      {/* Mobile overlay when thumbnails are open */}
      {showThumbnails && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setShowThumbnails(false)}
        />
      )}

      {/* Custom Scrollbar Styles */}
      <style
        jsx
        global
      >{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        @media (min-width: 768px) {
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 3px;
        }
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: #1f2937;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }

        /* Custom breakpoint for extra small screens */
        @media (min-width: 480px) {
          .xs\\:flex {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default PDFFlipbook;
