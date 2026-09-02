import { contents, news, records, works } from '$lib/server/content';

export const prerender = true;

const origin = 'https://kzgrm.com';

export function GET() {
	const pages = [
		{ path: '/', lastmod: contents[0]?.date },
		{ path: '/about/', lastmod: undefined },
		{ path: '/works/', lastmod: works[0]?.date },
		{ path: '/records/', lastmod: records[0]?.date },
		{ path: '/news/', lastmod: news[0]?.date },
		...works.map((item) => ({ path: `/works/${item.slug}/`, lastmod: item.date })),
		...records.map((item) => ({ path: `/records/${item.slug}/`, lastmod: item.date })),
		...news.map((item) => ({ path: `/news/${item.slug}/`, lastmod: item.date }))
	];

	const urls = pages
		.map(({ path, lastmod }) => {
			const encodedPath = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
			return `  <url><loc>${origin}${encodedPath}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
		})
		.join('\n');

	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
