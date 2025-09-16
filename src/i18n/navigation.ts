import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'hi', 'mr', 'ta'] as const;

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale: 'en'
});
