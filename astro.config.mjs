// @ts-check
import { defineConfig } from 'astro/config';
import remarkBreaks from 'remark-breaks';

import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

const githubPages = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: githubPages ? 'https://kzgrm.github.io' : 'http://localhost:9999',
  base: githubPages ? '/kzgrm-gallery' : undefined,
  output: 'static',
  markdown: {
    remarkPlugins: [remarkBreaks]
  },
  integrations: [svelte(), sitemap()],
  server: {
    host: '127.0.0.1',
    port: 9999
  },
  vite: {
    server: {
      allowedHosts: ['archlinux.tailed8ba3.ts.net']
    }
  }
});
