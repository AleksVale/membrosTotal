import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

async function proxyRequest(request: NextRequest, method: string) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');
  const backendUrl = `${BACKEND_URL}/api/auth${path}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  try {
    const response = await fetch(backendUrl, {
      method,
      headers,
      body: method === 'POST' ? await request.text() : undefined,
      credentials: 'include',
    });

    const data = await response.text();
    const responseHeaders = new Headers(response.headers);

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to proxy request' }),
      { status: 500 }
    );
  }
}
