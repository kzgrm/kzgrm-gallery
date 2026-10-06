import { contentSummaries, worksFor } from '$lib/server/content';
import type { PageServerLoad } from './$types';
import { parseLang } from '$lib/i18n';

export const load: PageServerLoad = ({ params }) => {
	return { works: contentSummaries(worksFor(parseLang(params.lang))) };
};
