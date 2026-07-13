import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('saas_session_token')?.value;
  const url = request.nextUrl.clone();

  const isAuthPage = url.pathname === '/login';
  const isDashboardPage = url.pathname.startsWith('/dashboard');
  const isAdminPage = url.pathname.startsWith('/admin');

  if (!sessionToken && (isDashboardPage || isAdminPage)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (sessionToken && isAuthPage) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (isAdminPage && sessionToken) {
    try {
      const payloadBase64 = sessionToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      if (decodedPayload.role !== 'ADMIN') {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } catch (e) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/admin/:path*'],
};
