export const locales = ['en', 'kn', 'hi', 'ta', 'te', 'bn', 'ml', 'ur'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];
