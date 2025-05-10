import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/employee')
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se houver token e estiver na página de login, redireciona para dashboard
  if (token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configura quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/employee/:path*',
    '/login'
  ]
} 