import { defaultLocale, type Locale } from './config';
import common from './de/common';
import layout from './de/layout';
import search from './de/search';
import objectDetails from './de/objectDetails';

import enCommon from './en/common';
import enLayout from './en/layout';
import enSearch from './en/search';
import enObjectDetails from './en/objectDetails';

// Every enabled language must provide the same sections, keys and value types.
export interface Messages {
  common: typeof common;
  layout: typeof layout;
  search: typeof search;
  objectDetails: typeof objectDetails;
}

const messages: Record<Locale, Messages> = {
  de: { common, layout, search, objectDetails },
  en: { common: enCommon, layout: enLayout, search: enSearch, objectDetails: enObjectDetails },
};
export function translate(locale: Locale = defaultLocale): Messages {
  return messages[locale];
}
