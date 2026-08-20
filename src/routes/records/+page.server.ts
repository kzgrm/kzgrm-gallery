import { contentSummaries, records } from '$lib/server/content';

export function load() { return { records: contentSummaries(records) }; }
