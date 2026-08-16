import { activities } from '$lib/server/activities';

export const prerender = true;

const origin = 'https://kzgrm.github.io/kzgrm-gallery';

export function GET() {
	const pages = [
		{ path: '/', lastmod: undefined },
		{ path: '/about/', lastmod: undefined },
		{ path: '/activities/', lastmod: activities[0]?.date },
		{ path: '/gallery/', lastmod: undefined },
		...activities.map((activity) => ({ path: `/activities/${activity.slug}/`, lastmod: activity.date }))
	];

	const urls = pages
		.map(({ path, lastmod }) => {
			const encodedPath = path
				.split('/')
				.map((segment) => encodeURIComponent(segment))
				.join('/');
			return `  <url><loc>${origin}${encodedPath}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
		})
		.join('\n');

	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
