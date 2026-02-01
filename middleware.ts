import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Allow public routes and auth API routes
  if (publicRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Redirect to sign-in if no token on protected routes
  if (!token) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
