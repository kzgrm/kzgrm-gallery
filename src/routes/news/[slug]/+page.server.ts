import { error } from '@sveltejs/kit';
import { findContent, news } from '$lib/server/content';

export function entries() { return news.map(({ slug }) => ({ slug })); }
export function load({ params }) {
	const content = findContent('news', params.slug);
	if (!content) error(404, 'News not found');
	return { content };
}
