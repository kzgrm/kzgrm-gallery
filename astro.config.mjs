// @ts-check
import { defineConfig } from 'astro/config';
import remarkBreaks from 'remark-breaks';

import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kzgrm-gallery.vercel.app',
  markdown: {
    remarkPlugins: [remarkBreaks]
  },
  integrations: [svelte(), sitemap()],
  adapter: vercel(),
  server: {
    port: 9999
  }
});