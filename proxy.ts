import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

const publicRoutes = ['/login']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicRoute = publicRoutes.some(r => pathname.startsWith(r))

  const sessionCookie = request.cookies.get('session')?.value
  const session = await decrypt(sessionCookie)

  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
}
