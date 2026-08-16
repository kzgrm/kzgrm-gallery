import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		host: '127.0.0.1',
		port: 9999,
		allowedHosts: ['archlinux.tailed8ba3.ts.net']
	},
	plugins: [sveltekit()]
});
