import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/signup'];
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Si es una ruta pública, permitir acceso
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Verificar si hay sesión en las cookies o headers
  // Por ahora usamos localStorage en el cliente, así que esto será manejado en el cliente
  // En producción, deberías usar cookies httpOnly con tokens JWT

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

