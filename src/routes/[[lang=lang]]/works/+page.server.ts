import { contentSummaries, worksFor } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	return { works: contentSummaries(worksFor(params.lang === 'en' ? 'en' : 'ja')) };
};
