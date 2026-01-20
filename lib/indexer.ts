/**
 * Google Indexer - Node.js Implementation
 * All indexing functionality in TypeScript/Node.js
 */

interface IndexResult {
  url: string;
  status: 'success' | 'failed';
  method: string;
  message?: string;
  error?: string;
  timestamp: string;
}

interface IndexResponse {
  url: string;
  status: 'success' | 'failed';
  methods_used: IndexResult[];
  timestamp: string;
}

/**
 * Ping Google with URL (DEPRECATED - No longer works)
 * Google discontinued this service. Use Google Indexing API instead.
 */
export async function pingGoogle(url: string): Promise<IndexResult> {
  return {
    url,
    status: 'failed',
    method: 'Google Ping (Deprecated)',
    error: 'Service discontinued by Google. Use Google Indexing API instead.',
    timestamp: new Date().toISOString()
  };
}

/**
 * Ping Bing with URL (DEPRECATED - No longer works)
 * Bing discontinued this service. Use IndexNow API instead.
 */
export async function pingBing(url: string): Promise<IndexResult> {
  return {
    url,
    status: 'failed',
    method: 'Bing Ping (Deprecated)',
    error: 'Service discontinued by Bing. Use IndexNow API instead.',
    timestamp: new Date().toISOString()
  };
}

/**
 * Submit URL via IndexNow GET method (simpler, works without key file hosting)
 * Submits to Bing and Yandex directly
 */
export async function submitToIndexNowGET(
  url: string,
  apiKey: string
): Promise<IndexResult> {
  const engines = [
    { name: 'Bing', url: 'https://www.bing.com/indexnow' },
    { name: 'Yandex', url: 'https://yandex.com/indexnow' }
  ];

  const results: { engine: string; success: boolean; status?: number }[] = [];

  for (const engine of engines) {
    try {
      const indexNowUrl = `${engine.url}?url=${encodeURIComponent(url)}&key=${apiKey}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(indexNowUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; IndexerBot/1.0)',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Log response details for debugging
      console.log(`${engine.name} Response:`, {
        status: response.status,
        statusText: response.statusText,
        url: indexNowUrl
      });

      // IndexNow returns 200 or 202 for success
      if (response.status === 200 || response.status === 202) {
        results.push({ engine: engine.name, success: true, status: response.status });
      } else {
        results.push({ engine: engine.name, success: false, status: response.status });
      }
    } catch (error: any) {
      console.error(`${engine.name} Error:`, error.message);
      results.push({ engine: engine.name, success: false });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failedEngines = results.filter(r => !r.success).map(r => r.engine);

  if (successCount > 0) {
    const successEngines = results.filter(r => r.success).map(r => r.engine).join(', ');
    const message = failedEngines.length > 0
      ? `✅ Submitted to ${successEngines} (Failed: ${failedEngines.join(', ')})`
      : `✅ Submitted to ${successEngines}`;

    return {
      url,
      status: 'success',
      method: 'IndexNow (GET)',
      message: message,
      timestamp: new Date().toISOString()
    };
  } else {
    const failureDetails = results.map(r => `${r.engine}: ${r.status || 'timeout/error'}`).join(', ');
    return {
      url,
      status: 'failed',
      method: 'IndexNow (GET)',
      error: `Failed to submit to all search engines. Details: ${failureDetails}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Submit URL via IndexNow POST method (centralized API)
 * Requires key file hosted on domain
 */
export async function submitToIndexNowPOST(
  url: string,
  apiKey: string,
  keyLocation?: string
): Promise<IndexResult> {
  try {
    // Extract host from URL for keyLocation
    const urlObj = new URL(url);
    const host = urlObj.hostname;

    const indexNowUrl = 'https://api.indexnow.org/indexnow';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const body = {
      host: host,
      key: apiKey,
      keyLocation: keyLocation || `https://${host}/${apiKey}.txt`,
      urlList: [url]
    };

    const response = await fetch(indexNowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // IndexNow returns 200 for success, 202 for accepted
    if (response.status === 200 || response.status === 202) {
      return {
        url,
        status: 'success',
        method: 'IndexNow (POST)',
        message: '✅ Submitted via IndexNow API',
        timestamp: new Date().toISOString()
      };
    } else if (response.status === 429) {
      return {
        url,
        status: 'failed',
        method: 'IndexNow (POST)',
        error: 'Rate limit exceeded. Try again later.',
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        url,
        status: 'failed',
        method: 'IndexNow (POST)',
        error: `HTTP ${response.status}`,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error: any) {
    return {
      url,
      status: 'failed',
      method: 'IndexNow (POST)',
      error: error.name === 'AbortError' ? 'Request timeout (15s)' : error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Index via Google Indexing API
 */
export async function indexViaGoogleAPI(
  url: string,
  credentials: any
): Promise<IndexResult> {
  try {
    const { google } = require('googleapis');
    
    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
    
    const authClient = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: authClient });
    
    // Submit URL
    await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED'
      }
    });

    return {
      url,
      status: 'success',
      method: 'Google Indexing API',
      message: '✅ Submitted to Google successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      url,
      status: 'failed',
      method: 'Google Indexing API',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Index a single URL using all available methods
 */
export async function indexSingleUrl(
  url: string,
  useGoogleAPI: boolean = false,
  googleCredentials?: any,
  indexNowKey?: string
): Promise<IndexResponse> {
  const methodsUsed: IndexResult[] = [];

  console.log(`\n📍 Processing: ${url}`);

  // Try Google API first if requested and credentials available
  if (useGoogleAPI && googleCredentials) {
    console.log('   → Using Google Indexing API...');
    const apiResult = await indexViaGoogleAPI(url, googleCredentials);
    methodsUsed.push(apiResult);

    if (apiResult.status === 'success') {
      console.log('   ✅ Success via Google API!');
    } else {
      console.log(`   ❌ Google API failed: ${apiResult.error}`);
    }
  }

  // Try IndexNow API if key is provided
  if (indexNowKey) {
    console.log('   → Using IndexNow API...');

    // Try GET method first (simpler, no key file required)
    const getResult = await submitToIndexNowGET(url, indexNowKey);
    methodsUsed.push(getResult);

    if (getResult.status === 'success') {
      console.log(`   ✅ IndexNow (GET) successful: ${getResult.message}`);
    } else {
      console.log(`   ⚠️  IndexNow (GET) failed: ${getResult.error}`);

      // Fallback to POST method if GET fails
      console.log('   → Trying IndexNow POST method...');
      const postResult = await submitToIndexNowPOST(url, indexNowKey);
      methodsUsed.push(postResult);

      if (postResult.status === 'success') {
        console.log(`   ✅ IndexNow (POST) successful!`);
      } else {
        console.log(`   ⚠️  IndexNow (POST) failed: ${postResult.error}`);
      }
    }
  }

  // If no modern methods are configured, show deprecation notice
  if (!useGoogleAPI && !indexNowKey) {
    console.log('   ⚠️  No API keys configured!');
    console.log('   → Please set up Google Indexing API or IndexNow API');
    console.log('   → Old ping methods have been discontinued by search engines');

    // Still call deprecated methods to show they don't work
    const googleResult = await pingGoogle(url);
    methodsUsed.push(googleResult);
    console.log(`   ❌ ${googleResult.error}`);

    const bingResult = await pingBing(url);
    methodsUsed.push(bingResult);
    console.log(`   ❌ ${bingResult.error}`);
  }

  // Overall success if any method worked
  const success = methodsUsed.some(m => m.status === 'success');

  if (success) {
    console.log('   ✅ Overall: SUCCESS');
  } else {
    console.log('   ❌ Overall: FAILED');
  }

  return {
    url,
    status: success ? 'success' : 'failed',
    methods_used: methodsUsed,
    timestamp: new Date().toISOString()
  };
}

/**
 * Index multiple URLs
 */
export async function indexMultipleUrls(
  urls: string[],
  useGoogleAPI: boolean = false,
  googleCredentials?: any,
  indexNowKey?: string
): Promise<IndexResponse[]> {
  const results: IndexResponse[] = [];

  const methods: string[] = [];
  if (useGoogleAPI) methods.push('Google API');
  if (indexNowKey) methods.push('IndexNow API');
  if (methods.length === 0) methods.push('None (deprecated methods only)');

  console.log('\n' + '='.repeat(60));
  console.log('🚀 Starting Indexing Session');
  console.log(`   URLs: ${urls.length}`);
  console.log(`   Methods: ${methods.join(', ')}`);
  console.log('='.repeat(60));

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`\n[${i + 1}/${urls.length}]`);

    const result = await indexSingleUrl(url, useGoogleAPI, googleCredentials, indexNowKey);
    results.push(result);

    // Small delay between requests
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.length - successful;

  console.log('\n' + '='.repeat(60));
  console.log('✨ Indexing Complete!');
  console.log(`   Total: ${results.length}`);
  console.log(`   ✅ Success: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');

  return results;
}

/**
 * Validate URLs
 */
export function validateUrls(urls: string[]): string[] {
  return urls
    .map(url => url.trim())
    .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')));
}
