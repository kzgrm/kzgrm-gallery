import { contentSummaries, recordsFor } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	return { records: contentSummaries(recordsFor(params.lang === 'en' ? 'en' : 'ja')) };
};
