import { defaultLocale, type Locale } from './config';
import common from './de/common';
import layout from './de/layout';
import search from './de/search';
import objectDetails from './de/objectDetails';

// Every enabled language must provide the same sections, keys and value types.
export interface Messages {
  common: typeof common;
  layout: typeof layout;
  search: typeof search;
  objectDetails: typeof objectDetails;
}

const messages: Record<Locale, Messages> = {
  de: { common, layout, search, objectDetails },
};
export function translate(locale: Locale = defaultLocale): Messages {
  return messages[locale];
}
