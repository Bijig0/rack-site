import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  proxyToServer,
  handleProxyResponse,
  createProxyErrorResponse,
} from '@/lib/api-proxy';

/**
 * GET /api/reports/jobs/[jobId]
 * Polls the status of a report generation job.
 * Proxies to the dedicated Railway server.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // 1. Authenticate the user
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { jobId } = await params;

    // 2. Forward status check to dedicated server
    const response = await proxyToServer(`/api/reports/jobs/${jobId}`, {
      method: 'GET',
      timeout: 10000,
    });

    // 3. Return job status
    return handleProxyResponse(response);
  } catch (error) {
    return createProxyErrorResponse(error, 'GET /api/reports/jobs/[jobId]');
  }
}
