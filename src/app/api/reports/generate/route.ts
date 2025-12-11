import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  proxyToServer,
  handleProxyResponse,
  createProxyErrorResponse,
} from '@/lib/api-proxy';

/**
 * POST /api/reports/generate
 * Initiates a new report generation job.
 * Proxies to the dedicated Railway server.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user
    const session = await getSession();
    if (!session) {
      console.log('[/api/reports/generate] No session found');
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    console.log('[/api/reports/generate] Session found for user:', session.userId);

    // 2. Parse request body
    const body = await request.json();
    console.log('[/api/reports/generate] Request body:', { ...body, propertyId: body.propertyId });

    // 3. Forward to dedicated server with user context
    const response = await proxyToServer('/api/reports/generatePdf', {
      method: 'POST',
      body: {
        ...body,
        userId: session.userId,
      },
      timeout: 30000,
    });

    console.log('[/api/reports/generate] Proxy response status:', response.status);

    // 4. Return the response (jobId, statusUrl)
    return handleProxyResponse(response);
  } catch (error) {
    console.error('[/api/reports/generate] Error:', error);
    return createProxyErrorResponse(error, 'POST /api/reports/generate');
  }
}
