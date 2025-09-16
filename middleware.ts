import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'hi', 'mr', 'ta'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
    '/(en|hi|mr|ta)/:path*'
  ]
};
