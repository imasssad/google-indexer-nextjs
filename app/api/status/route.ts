import { NextResponse } from 'next/server';

// This would ideally import from a shared state, but for simplicity:
let lastResults: any[] = [];
let isIndexing = false;

export async function GET() {
  try {
    if (isIndexing) {
      return NextResponse.json({
        status: 'indexing',
        in_progress: true,
        message: 'Indexing in progress...'
      });
    }

    if (lastResults && lastResults.length > 0) {
      const successful = lastResults.filter(r => r.status === 'success').length;
      
      return NextResponse.json({
        status: 'complete',
        in_progress: false,
        total: lastResults.length,
        successful,
        failed: lastResults.length - successful,
        results: lastResults
      });
    }

    return NextResponse.json({
      status: 'idle',
      in_progress: false,
      message: 'Ready to index'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
