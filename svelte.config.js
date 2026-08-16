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
			base: process.env.GITHUB_ACTIONS === 'true' ? '/kzgrm-gallery' : ''
		},
		prerender: {
			handleHttpError: 'warn'
		}
	}
}
