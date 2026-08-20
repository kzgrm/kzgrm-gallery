import { error } from '@sveltejs/kit';
import { findContent, records } from '$lib/server/content';

export function entries() { return records.map(({ slug }) => ({ slug })); }
export function load({ params }) {
	const content = findContent('record', params.slug);
	if (!content) error(404, 'Record not found');
	return { content };
}
