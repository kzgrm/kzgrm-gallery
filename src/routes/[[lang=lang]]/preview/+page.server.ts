import { contentSummaries, newsFor, recordsFor, worksFor } from '$lib/server/content';
import type { PageServerLoad } from './$types';
import { parseLang } from '$lib/i18n';

// The preview shows the real listing pages with the unsaved item placed in them, so it needs
// what those pages list. All of it is already public on the pages themselves.
export const load: PageServerLoad = ({ params }) => {
	const lang = parseLang(params.lang);
	return { works: contentSummaries(worksFor(lang)), records: contentSummaries(recordsFor(lang)), news: contentSummaries(newsFor(lang)) };
};
