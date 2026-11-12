import de from '../data/navigation.de.json';
import type { Locale } from '../i18n/config';
const navigation = { de };
export function getNavigation(locale: Locale) { return navigation[locale]; }
