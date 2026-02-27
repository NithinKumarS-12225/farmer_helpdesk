import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n.config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already starts with a locale
  const localePattern = new RegExp(`^/(${locales.join('|')})`);
  if (localePattern.test(pathname)) {
    return NextResponse.next();
  }

  // Redirect to default locale
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
