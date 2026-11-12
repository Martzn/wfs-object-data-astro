# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Navigation und lokale Markenassets

`npm run build` lädt vor dem Astro-Build einmal die Menülinks von
https://firmen.standort-sachsen.de/company/de/ mit Cheerio. Die geprüften Daten
werden in `src/data/navigation.de.json` gespeichert. Abruf- oder Strukturfehler
brechen den Build ab; gespeicherte Menüdaten werden nicht als Ersatz verwendet. Netzwerkzugriff ist beim
Build erforderlich; im Browser werden keine Menüdaten nachgeladen.

- `npm run sync:navigation`: Menüdaten manuell aktualisieren.
- `npm run sync:assets`: zusätzlich Logos, Favicons, Original-Styles und Webfonts aktualisieren.
- `npm run dev -- --background`: Entwicklung mit den gespeicherten Menüdaten.

Die Assets unter `public/brand/` stammen von der genannten Quellseite; das
Sachsen-Logo wurde aus dem Inline-SVG extrahiert. Header und Footer verwenden das Original-Markup und lokale Original-Styles;
die Dropdown-Bedienung ist ohne jQuery lokal implementiert. Kontaktangaben und Markenbeschriftungen sind lokal gepflegt.

## Mehrsprachigkeit

`src/i18n/config.ts` enthält ausschließlich aktivierte Sprachen, Standardsprache
und Sprachnamen. Die deutschen UI-Texte liegen nach Bereichen getrennt in:

- `src/i18n/de/common.ts`: gemeinsame Texte.
- `src/i18n/de/layout.ts`: Header, Footer und Sprachwahl.
- `src/i18n/de/search.ts`: Suche und Navigation zwischen Treffern.
- `src/i18n/de/objectDetails.ts`: Detailseiten.

`src/i18n/messages.ts` bündelt die Bereiche und prüft über `Record<Locale, Messages>`,
dass jede aktivierte Sprache alle Bereiche, Schlüssel und Werttypen bereitstellt.
Komponenten verwenden beispielsweise `translate(locale).search`.
Externe Menüinhalte bleiben separat in `src/data/navigation.de.json`.

Alle Inhaltsseiten haben ein Sprachpräfix: `/de/` und `/de/objects/OBJ-0001/`.
`src/i18n/paths.ts` erzeugt diese Pfade zentral, auch für Suchlinks und Rücksprünge.
Die statischen Routen unter `src/pages/[locale]/` werden für die aktivierten
Sprachen erzeugt. `/objects.json` bleibt ein gemeinsam genutzter Datenendpunkt;
die darin enthaltenen URLs zeigen auf die Standardsprache.

`/` leitet über Astros i18n-Konfiguration (`redirectToDefaultLocale: true`)
auf `/de/` weiter. Alte
Objektrouten ohne Sprachpräfix existieren nicht. Im statischen Build erzeugt
Astro für die Startseite eine HTML-Weiterleitung; HTTP-Weiterleitungen können
später beim Hosting ergänzt werden.

Aktuell ist nur Deutsch aktiviert. Für weitere Sprachen Übersetzungsbereiche
und Menüdaten ergänzen und registrieren, dann die Sprache in `locales` aktivieren
und die Sprachwahl um die entsprechenden Links erweitern. Die Inhaltsrouten
werden automatisch erzeugt; Objektinhalte werden nicht automatisch übersetzt.

Node.js mindestens 22.19 verwenden (Cheerio-Abhängigkeit).

### Originalgetreuer Header und Footer

`npm run sync:styles` aktualisiert die drei Original-Stylesheets (`font.css`,
`wfs.min.css`, `kwec.css`), 16 Webfonts und das mobile Footer-Logo.
Die unveränderten CSS-Quelldateien liegen zusammen mit dem generierten
`chrome.css` unter `public/brand/original/`. Die Schriftdefinitionen werden auf
lokale WOFF2-/WOFF-Dateien umgestellt. Es gibt keine externen Font-Anfragen.

Die Originalregeln gelten global für Header, Inhalt und Footer. Bootstrap,
Reset, Breakpoints, Typografie, Farben und Raster stammen aus der Vorlage.
Eigene Komponenten ergänzen nur die anwendungsspezifische Darstellung.
Mit `npm run sync:styles -- --offline` lässt sich das globale Stylesheet aus
den bereits gespeicherten CSS-Quelldateien ohne Download neu erzeugen.
Die Sprachwahl enthält weiterhin nur Deutsch. Die Versionszeile verwendet
Name und Version dieser Anwendung statt der KWeC-Versionsangabe der Quelle.
