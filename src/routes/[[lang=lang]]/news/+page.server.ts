import { contentSummaries, newsFor } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	return { news: contentSummaries(newsFor(params.lang === 'en' ? 'en' : 'ja')) };
};
