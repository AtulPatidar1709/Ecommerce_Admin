import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const url = request.nextUrl;

  // Retrieve the token for the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  // If authenticated, prevent accessing the sign-in and sign-up pages
  if (token && (url.pathname === '/sign-in' || url.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If not authenticated and trying to access a protected route, redirect to sign-in
  if (!token && !['/sign-in', '/sign-up'].includes(url.pathname)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Proceed to the requested route
  return NextResponse.next();
}

// Middleware configuration: match paths except 'sign-in' and 'sign-up'
export const config = {
  matcher: ['/profile', '/', '/categories', '/products', '/orders'], // Match all routes that need authentication, exclude '/sign-in' and '/sign-up'
};
