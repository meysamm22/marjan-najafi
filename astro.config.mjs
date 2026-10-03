import { defineConfig } from 'astro/config';

// On GitHub Pages the site lives under /<repo>/; the deploy workflow passes
// both values in. Locally (and on a custom domain) it is served from the root.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: { prefixDefaultLocale: false },
  },
});
