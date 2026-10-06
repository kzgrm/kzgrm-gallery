import { contentSummaries, newsFor } from '$lib/server/content';
import type { PageServerLoad } from './$types';
import { parseLang } from '$lib/i18n';

export const load: PageServerLoad = ({ params }) => {
	return { news: contentSummaries(newsFor(parseLang(params.lang))) };
};
