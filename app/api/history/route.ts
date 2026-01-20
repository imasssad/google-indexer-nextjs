import { NextRequest, NextResponse } from 'next/server';
import { readHistory, getStats, clearHistory } from '@/lib/storage';

/**
 * GET /api/history - Get indexing history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const statsOnly = searchParams.get('stats') === 'true';

    if (statsOnly) {
      // Return only statistics
      const stats = await getStats();
      return NextResponse.json(stats);
    }

    // Return full history
    const history = await readHistory(limit);

    return NextResponse.json({
      total: history.length,
      showing: history.length,
      history: history // Already sorted by created_at DESC
    });
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/history - Clear all history
 */
export async function DELETE(request: NextRequest) {
  try {
    clearHistory();
    return NextResponse.json({
      status: 'success',
      message: 'History cleared successfully'
    });
  } catch (error: any) {
    console.error('Error clearing history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear history' },
      { status: 500 }
    );
  }
}
