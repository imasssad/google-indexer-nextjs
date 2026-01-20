import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Google Instant Indexer',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    platform: 'Next.js + Node.js'
  });
}
