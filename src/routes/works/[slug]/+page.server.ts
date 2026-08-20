import { error } from '@sveltejs/kit';
import { findContent, works } from '$lib/server/content';

export function entries() { return works.map(({ slug }) => ({ slug })); }
export function load({ params }) {
	const content = findContent('work', params.slug);
	if (!content) error(404, 'Work not found');
	return { content };
}
