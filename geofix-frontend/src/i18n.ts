export const locales = ["en", "hi", "mr", "ta"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";
