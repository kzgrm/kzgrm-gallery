// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kzgrm-gallery.vercel.app',
  integrations: [svelte(), sitemap()],
  adapter: vercel()
});