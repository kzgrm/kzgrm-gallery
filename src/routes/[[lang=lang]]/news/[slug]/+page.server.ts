import { error } from '@sveltejs/kit';
import { findContentFor, news } from '$lib/server/content';
import type { PageServerLoad } from './$types';
import { parseLang } from '$lib/i18n';

export function entries() { return news.map(({ slug }) => ({ slug })); }
export const load: PageServerLoad = ({ params }) => {
	const content = findContentFor('news', params.slug, parseLang(params.lang));
	if (!content) error(404, 'News not found');
	return { content };
};
