import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  
  // Se não houver token e estiver tentando acessar rotas protegidas
  if (!token && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/collaborator') ||
    request.nextUrl.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se houver token e estiver na página de login, redireciona para dashboard apropriado
  if (token && request.nextUrl.pathname === '/login') {
    // Aqui você pode implementar lógica para redirecionar baseado no perfil do usuário
    // Por enquanto, redireciona para collaborator/dashboard
    return NextResponse.redirect(new URL('/collaborator/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configura quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admin/:path*',
    '/collaborator/:path*',
    '/login'
  ]
} 