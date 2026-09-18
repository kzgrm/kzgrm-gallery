import { error } from '@sveltejs/kit';
import { findContentFor, records } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export function entries() { return records.map(({ slug }) => ({ slug })); }
export const load: PageServerLoad = ({ params }) => {
	const content = findContentFor('record', params.slug, params.lang === 'en' ? 'en' : 'ja');
	if (!content) error(404, 'Record not found');
	return { content };
};
