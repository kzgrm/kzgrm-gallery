import { contentSummaries, railNews } from '$lib/server/content';

export function load() {
	return { railNews: contentSummaries(railNews) };
}
