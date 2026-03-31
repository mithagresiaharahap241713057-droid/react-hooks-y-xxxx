import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil token dari cookie (sesuaikan dengan nama cookie auth kamu)
  const token = request.cookies.get('next-auth.session-token') || request.cookies.get('token');

  const { pathname } = request.nextUrl;

  // 2. Proteksi halaman /home
  // Jika user mencoba ke /home tapi tidak punya token
  if (pathname.startsWith('/home')) {
    if (!token) {
      // Lempar ke halaman not-authorized yang kamu buat tadi
      return NextResponse.redirect(new URL('/auth/not-authorized', request.url));
    }
  }

  return NextResponse.next();
}

// 3. Konfigurasi agar middleware hanya berjalan di path tertentu
export const config = {
  matcher: ['/home/:path*'], 
};