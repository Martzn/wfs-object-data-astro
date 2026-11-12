import * as cheerio from 'cheerio';
import { mkdir, writeFile } from 'node:fs/promises';

const source = 'https://firmen.standort-sachsen.de/company/de/';
const root = new URL('../', import.meta.url);
const assets = [
  ['header .servicenavigation img', 'wfs.svg', 'src'],
  ['link[rel="apple-touch-icon"]', 'apple-touch-icon.png', 'href'],
  ['link[rel="icon"][sizes="32x32"]', 'favicon-32x32.png', 'href'],
  ['link[rel="icon"][sizes="16x16"]', 'favicon-16x16.png', 'href'],
];

async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Abruf fehlgeschlagen: ${url} (${response.status})`);
  return response;
}

async function loadPage() {
  const response = await download(source);
  const html = await response.text();
  return cheerio.load(html);
}

function extractLink(page, element) {
  const node = page(element);
  const label = node.text().replace(/\s+/g, ' ').trim();
  const raw = node.attr('href');
  if (!label || !raw || raw.startsWith('#')) throw new Error(`Ungültiger Menülink: ${label}`);
  const href = new URL(raw, source);
  if (!['https:', 'http:'].includes(href.protocol)) throw new Error(`Ungültiges Linkziel: ${href}`);
  return { label, href: href.href };
}

function extractLinks(page, selector) {
  const result = page(selector).toArray().map(element => extractLink(page, element));
  if (!result.length) throw new Error(`Menü fehlt: ${selector}`);
  return result;
}

function extractFooterGroups(page) {
  const groups = page('footer nav').toArray()
    .filter(element => page(element).children('h2').length)
    .map(element => ({
      ...extractLink(page, page(element).children('h2').find('a').get(0)),
      links: page(element).children('ul').find('a').toArray()
        .map(link => extractLink(page, link)),
    }));

  if (!groups.length || groups.some(group => !group.links.length)) {
    throw new Error('Footer-Menügruppen fehlen oder sind leer.');
  }
  return groups;
}

function extractNavigation(page) {
  return {
    source,
    portals: extractLinks(page, 'header .portal-selection-desktop .dropdown-menu a'),
    headerLinks: extractLinks(page, 'header .servicenavigation nav > ul > li > a:not(.dropdown-toggle)'),
    footerLinks: extractLinks(page, 'footer .servicenavigation nav a'),
    footerGroups: extractFooterGroups(page),
  };
}

async function saveNavigation(data) {
  await mkdir(new URL('src/data/', root), { recursive: true });
  await writeFile(new URL('src/data/navigation.de.json', root), JSON.stringify(data, null, 2) + '\n');
}

async function syncAssets(page) {
  const directory = new URL('public/brand/', root);
  await mkdir(directory, { recursive: true });

  const logo = page('#logo svg').first().toString();
  if (!logo) throw new Error('Sachsen-Logo fehlt.');
  await writeFile(new URL('sachsen.svg', directory), logo);

  for (const [selector, filename, attribute] of assets) {
    const path = page(selector).first().attr(attribute);
    if (!path) throw new Error(`Asset fehlt: ${selector}`);
    const response = await download(new URL(path, source));
    const bytes = await response.arrayBuffer();
    await writeFile(new URL(filename, directory), Buffer.from(bytes));
  }

  await import('./sync-chrome-styles.mjs');
}

async function main() {
  const page = await loadPage();
  const data = extractNavigation(page);
  await saveNavigation(data);

  // Assets are refreshed explicitly, not on every build.
  if (process.argv.includes('--assets')) {
    await syncAssets(page);
  }

  console.log(`Navigation importiert: ${data.portals.length} Portale, ${data.footerGroups.length} Footer-Gruppen.`);
}

await main();
