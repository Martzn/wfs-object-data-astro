import { defaultLocale, type Locale } from './config';

export function homePath(locale: Locale = defaultLocale): string {
  return `/${locale}/`;
}

export function objectPath(id: string, locale: Locale = defaultLocale): string {
  return `${homePath(locale)}objects/${encodeURIComponent(id)}/`;
}
