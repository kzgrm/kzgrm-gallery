import { contentSummaries, works } from '$lib/server/content';

export function load() {
	return { works: contentSummaries(works) };
}
