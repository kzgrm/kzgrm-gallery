import type { Handle } from '@sveltejs/kit';

// Fills in app.html's %lang% placeholder for <html lang="...">. Runs during
// prerendering too (adapter-static executes hooks.server.ts at build time), so
// every generated page gets the correct lang attribute baked in statically.
export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.params.lang === 'en' ? 'en' : 'ja';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
