import { contentsFor, newsFor, recordsFor, worksFor } from '$lib/server/content';
import type { Lang } from '$lib/types/content';
import { langPrefix, langs } from '$lib/i18n';

export const prerender = true;

const origin = 'https://kzgrm.com';

function pagesFor(lang: Lang) {
	const contents = contentsFor(lang);
	const works = worksFor(lang);
	const records = recordsFor(lang);
	const news = newsFor(lang);
	const prefix = langPrefix(lang);
	return [
		{ path: `${prefix}/`, lastmod: contents[0]?.date },
		{ path: `${prefix}/about/`, lastmod: undefined },
		{ path: `${prefix}/works/`, lastmod: works[0]?.date },
		{ path: `${prefix}/records/`, lastmod: records[0]?.date },
		{ path: `${prefix}/news/`, lastmod: news[0]?.date },
		...records.map((item) => ({ path: `${prefix}/records/${item.slug}/`, lastmod: item.date })),
		...news.map((item) => ({ path: `${prefix}/news/${item.slug}/`, lastmod: item.date }))
	];
}

// Every locale shares the same slug-based path shape.
export function GET() {
	const pagesByLang = Object.fromEntries(langs.map((lang) => [lang, pagesFor(lang)])) as Record<Lang, ReturnType<typeof pagesFor>>;

	const urls = langs.flatMap((currentLang) => pagesByLang[currentLang]
		.map(({ path, lastmod }, index) => {
			const alternates = langs
				.map((lang) => {
					const altPath = pagesByLang[lang][index]!.path;
					const encodedPath = altPath.split('/').map((segment) => encodeURIComponent(segment)).join('/');
					return `<xhtml:link rel="alternate" hreflang="${lang}" href="${origin}${encodedPath}"/>`;
				})
				.join('');
			const encodedPath = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
			return `  <url><loc>${origin}${encodedPath}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${alternates}</url>`;
		}))
		.join('\n');

	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
