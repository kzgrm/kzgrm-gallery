import { error } from '@sveltejs/kit';
import { findContentFor, records } from '$lib/server/content';
import type { PageServerLoad } from './$types';
import { parseLang } from '$lib/i18n';

export function entries() { return records.map(({ slug }) => ({ slug })); }
export const load: PageServerLoad = ({ params }) => {
	const content = findContentFor('record', params.slug, parseLang(params.lang));
	if (!content) error(404, 'Record not found');
	return { content };
};
