import de from '../data/navigation.de.json';
import en from '../data/navigation.en.json';
import type { Locale } from '../i18n/config';

const navigation: Record<Locale, typeof de> = { de, en };

export function getNavigation(locale: Locale) { return navigation[locale]; }
