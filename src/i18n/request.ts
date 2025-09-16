import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'hi', 'mr', 'ta'] as const;

export default getRequestConfig(async ({ locale }) => {
  // If locale is undefined, don't immediately fallback to 'en'
  // Let next-intl handle the routing properly
  if (!locale) {
    return {
      locale: 'en', // fallback for undefined cases
      messages: (await import('../../messages/en.json')).default
    };
  }
  
  // Validate that the incoming `locale` parameter is valid
  const validatedLocale = locales.includes(locale as any) ? locale : 'en';

  return {
    locale: validatedLocale,
    messages: (await import(`../../messages/${validatedLocale}.json`)).default
  };
});
