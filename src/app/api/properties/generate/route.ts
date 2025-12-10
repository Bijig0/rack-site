import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  proxyToServer,
  handleProxyResponse,
  createProxyErrorResponse,
} from '@/lib/api-proxy';

/**
 * POST /api/properties/generate
 * Initiates a new property generation job.
 * Proxies to the dedicated Railway server.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user
    const session = await getSession();
    console.log('[/api/properties/generate] Session:', session ? `userId: ${session.userId}` : 'null');

    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();

    // 3. Forward to dedicated server with user context
    const response = await proxyToServer('/api/properties/generate', {
      method: 'POST',
      body: {
        ...body,
        userId: session.userId,
      },
      timeout: 30000,
    });

    // 4. Get the response data
    const data = await response.json();

    // 5. Rewrite the statusUrl to go through our proxy
    if (data.jobId && data.statusUrl) {
      // Replace the external statusUrl with our proxy endpoint
      data.statusUrl = `/api/properties/jobs/${data.jobId}`;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return createProxyErrorResponse(error, 'POST /api/properties/generate');
  }
}
