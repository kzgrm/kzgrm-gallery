import { contentSummaries, railNewsFor } from '$lib/server/content';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params }) => {
	return { railNews: contentSummaries(railNewsFor(params.lang === 'en' ? 'en' : 'ja')) };
};
