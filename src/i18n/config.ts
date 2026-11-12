export const defaultLocale = 'de' as const;
export const locales = ['de'] as const;
export type Locale = (typeof locales)[number];
export const languageNames: Record<Locale, string> = { de: 'Deutsch' };

// Add translations and corresponding routes before enabling another locale.
const messages = {
  de: {
    portals: 'Unsere Portale', language: 'Sprache', slogan: 'Ein Standort in Bestform',
    provider: 'Ein Angebot der Wirtschaftsförderung Sachsen GmbH',
    navigation: 'Servicenavigation', footerNavigation: 'Weitere Informationen',
    skip: 'Zum Inhalt', contact: 'Kontakt', email: 'Schreiben Sie uns',
    searchTitle: 'Objekte suchen', query: 'Suchbegriff', queryPlaceholder: 'Name, Ort oder Postleitzahl',
    category: 'Kategorie', allCategories: 'Alle Kategorien', district: 'Landkreis', allDistricts: 'Alle Landkreise',
    reset: 'Zurücksetzen', loading: 'Objekte werden geladen …', searchPrompt: 'Bitte gib einen Suchbegriff ein oder wähle einen Filter.',
    noResults: 'Keine Treffer. Bitte ändere den Suchbegriff oder die Filter.', retry: 'Erneut laden',
    results: 'Suchergebnisse', name: 'Name', address: 'Adresse', resultPages: 'Ergebnisseiten',
    searchNavigation: 'Navigation im Suchergebnis', backToSearch: 'Zurück zur Suche',
    loadError: 'Die Objekte konnten nicht geladen werden. Bitte versuche es erneut.',
    mapLocation: 'Standort',
    resultSummary: (count: number, first: number, last: number) => `${count} ${count === 1 ? 'Objekt' : 'Objekte'} gefunden · Treffer ${first}–${last}`,
    database: 'Objektdatenbank', noScript: 'JavaScript muss aktiviert sein, um die Objektsuche zu verwenden.',
  },
};
export function translate(locale: Locale = defaultLocale) { return messages[locale]; }
