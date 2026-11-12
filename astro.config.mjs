// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import { defaultLocale, locales } from './src/i18n/config';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  i18n: { defaultLocale, locales: [...locales], routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true } },
});
