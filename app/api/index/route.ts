import { NextRequest, NextResponse } from 'next/server';
import { indexMultipleUrls, validateUrls } from '@/lib/indexer';
import { saveResults } from '@/lib/storage';

// Store results in memory for status checking
let internalIsIndexing = false;

export async function POST(request: NextRequest) {
  try {
    // Check if already indexing
    if (internalIsIndexing) {
      return NextResponse.json(
        { error: 'Indexing already in progress' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { urls, use_google_api = false, google_credentials = null, indexnow_key = null } = body;

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    // Validate URLs
    const validUrls = validateUrls(urls);

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid URLs provided (must start with http:// or https://)' },
        { status: 400 }
      );
    }

    // Get Google credentials from request body or environment variable
    let googleCredentials = google_credentials;
    if (use_google_api && !googleCredentials) {
      const envCredentials = process.env.GOOGLE_CREDENTIALS;
      if (envCredentials) {
        try {
          googleCredentials = JSON.parse(envCredentials);
        } catch (e) {
          console.error('Failed to parse GOOGLE_CREDENTIALS env var:', e);
        }
      }
    }

    if (use_google_api && !googleCredentials) {
      return NextResponse.json(
        { error: 'Google API requested but no credentials configured. Set GOOGLE_CREDENTIALS in environment variables.' },
        { status: 400 }
      );
    }

    // Get IndexNow key from environment if not provided in request
    const indexNowApiKey = indexnow_key || process.env.INDEXNOW_API_KEY;

    // Start indexing
    internalIsIndexing = true;

    // Index URLs
    const results = await indexMultipleUrls(
      validUrls,
      use_google_api,
      googleCredentials,
      indexNowApiKey
    );

    internalIsIndexing = false;

    // Save results to Supabase
    saveResults(results);

    // Return results
    const successful = results.filter(r => r.status === 'success').length;

    return NextResponse.json({
      status: 'success',
      message: `Processed ${validUrls.length} URLs`,
      total: results.length,
      successful,
      failed: results.length - successful,
      results
    });

  } catch (error: any) {
    internalIsIndexing = false;
    console.error('Error in index API:', error);

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
