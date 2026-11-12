import { defaultLocale, locales, type Locale } from './config';

export function homePath(locale: Locale = defaultLocale): string {
  return `/${locale}/`;
}

export function objectPath(id: string, locale: Locale = defaultLocale): string {
  return `${homePath(locale)}objects/${encodeURIComponent(id)}/`;
}

/** Keep the current page when changing language; replace only the locale segment. */
export function languagePath(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (locales.some(language => language === segments[0])) segments.shift();
  return `${homePath(locale)}${segments.length ? `${segments.join('/')}/` : ''}`;
}
