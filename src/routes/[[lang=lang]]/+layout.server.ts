import { contentSummaries, railNewsFor } from '$lib/server/content';
import type { LayoutServerLoad } from './$types';
import { parseLang } from '$lib/i18n';

export const load: LayoutServerLoad = ({ params }) => {
	return { railNews: contentSummaries(railNewsFor(parseLang(params.lang))) };
};
