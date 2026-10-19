import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: '',
			relative: false // 404.html is also served at arbitrary nested URLs by GitHub Pages.
		},
		prerender: {
			handleHttpError: 'warn'
		}
	}
}
