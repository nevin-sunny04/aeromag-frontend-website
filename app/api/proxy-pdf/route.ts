import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const pdfUrl = req.nextUrl.searchParams.get('url');
  const forceDownload = req.nextUrl.searchParams.get('download') === 'true';
  const filenameParam = req.nextUrl.searchParams.get('filename');

  if (!pdfUrl) {
    return new NextResponse('PDF URL is required', { status: 400 });
  }

  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.status}`, {
        status: response.status,
      });
    }

    const buffer = await response.arrayBuffer();

    // Extract filename
    const urlParts = pdfUrl.split('/');
    let filename = filenameParam || urlParts[urlParts.length - 1] || 'document.pdf';

    // Ensure .pdf extension
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename = filename + '.pdf';
    }

    // Force download if requested
    const contentDisposition = forceDownload
      ? `attachment; filename="${filename}"`
      : `inline; filename="${filename}"`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': contentDisposition,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('PDF proxy error:', error);
    return new NextResponse('Failed to fetch PDF', { status: 500 });
  }
}
