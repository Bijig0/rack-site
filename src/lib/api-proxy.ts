/**
 * Proxy utility for forwarding requests to the dedicated Railway server.
 * Used for long-running operations like PDF report generation.
 */

import { NextResponse } from 'next/server';

const DEDICATED_SERVER_URL = process.env.DEDICATED_SERVER_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

export interface ProxyOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  timeout?: number;
}

/**
 * Forward a request to the dedicated server with internal API key authentication.
 */
export async function proxyToServer(
  path: string,
  options: ProxyOptions = {}
): Promise<Response> {
  if (!DEDICATED_SERVER_URL) {
    throw new Error('DEDICATED_SERVER_URL environment variable is not configured');
  }
  if (!INTERNAL_API_KEY) {
    throw new Error('INTERNAL_API_KEY environment variable is not configured');
  }

  const { method = 'GET', body, timeout = 30000 } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${DEDICATED_SERVER_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': INTERNAL_API_KEY,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ProxyError('TIMEOUT', 'Request to report server timed out', 504);
    }
    throw error;
  }
}

/**
 * Convert a proxy response to a NextResponse.
 */
export async function handleProxyResponse(response: Response): Promise<NextResponse> {
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

/**
 * Custom error class for proxy failures.
 */
export class ProxyError extends Error {
  constructor(
    public code: 'TIMEOUT' | 'CONNECTION_FAILED' | 'UPSTREAM_ERROR',
    message: string,
    public statusCode: number = 502
  ) {
    super(message);
    this.name = 'ProxyError';
  }
}

/**
 * Create an error response for proxy failures.
 */
export function createProxyErrorResponse(
  error: unknown,
  context: string
): NextResponse {
  console.error(`[Proxy Error] ${context}:`, error);

  if (error instanceof ProxyError) {
    return NextResponse.json(
      {
        status: 'fail',
        message: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  const isDev = process.env.NODE_ENV === 'development';

  return NextResponse.json(
    {
      status: 'fail',
      message: 'Failed to connect to report service',
      ...(isDev && { error: message }),
    },
    { status: 502 }
  );
}
