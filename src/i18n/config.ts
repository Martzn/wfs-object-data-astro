export const defaultLocale = 'de' as const;
export const locales = ['de'] as const;
export type Locale = (typeof locales)[number];
export const languageNames: Record<Locale, string> = { de: 'Deutsch' };
