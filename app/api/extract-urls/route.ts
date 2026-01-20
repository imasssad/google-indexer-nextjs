import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if it's a PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Read file as text (simple approach for PDFs with text content)
    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf-8');

    // Extract URLs using regex
    const urlRegex = /https?:\/\/[^\s<>"]+/gi;
    const matches = text.match(urlRegex) || [];

    // Filter valid URLs and remove duplicates
    const urls = Array.from(new Set(
      matches
        .filter(url => url.startsWith('http://') || url.startsWith('https://'))
        .map(url => url.replace(/[.,;!?)]$/, '')) // Remove trailing punctuation
    ));

    return NextResponse.json({
      success: true,
      count: urls.length,
      urls: urls
    });

  } catch (error: any) {
    console.error('Error extracting URLs from PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract URLs from PDF' },
      { status: 500 }
    );
  }
}
