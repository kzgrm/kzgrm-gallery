import { contentSummaries, records, works } from '$lib/server/content';

export function load() {
	return { latestRecords: contentSummaries(records.slice(0, 3)), works: contentSummaries(works), initialEdition: 'nostalgic' as const };
}
