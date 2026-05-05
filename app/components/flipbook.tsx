'use client';
import dynamic from 'next/dynamic';

// Dynamically import the PDFFlipbook component to disable SSR
const PDFFlipbook = dynamic(() => import('../../components/ui/flipbook'), {
  ssr: false,
});

interface FlipBookProps {
  title: string;
  pdfUrl: string;
  downloadUrl?: string;
}

export default function FlipBook({ title, pdfUrl, downloadUrl }: FlipBookProps) {
  return (
    <>
      <PDFFlipbook
        title={title}
        pdfUrl={pdfUrl}
        downloadUrl={downloadUrl}
      />
    </>
  );
}
