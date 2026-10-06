import { contentSummaries, recordsFor } from '$lib/server/content';
import type { PageServerLoad } from './$types';
import { parseLang } from '$lib/i18n';

export const load: PageServerLoad = ({ params }) => {
	return { records: contentSummaries(recordsFor(parseLang(params.lang))) };
};
