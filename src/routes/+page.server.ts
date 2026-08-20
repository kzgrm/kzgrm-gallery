import { contentSummaries, records } from '$lib/server/content';

export function load() {
	return { latestRecords: contentSummaries(records.slice(0, 3)) };
}
