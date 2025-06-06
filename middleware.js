import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  console.log('Middleware executed for:', req.nextUrl.pathname);

  if (req.method === 'GET') {
    console.log('GET request allowed without authentication');
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/articles/:path*', '/api/wiki-options/:path*', '/api/tab-options/:path*', '/api/tab-articles/:path*'],
};