import { contentSummaries, records, works } from '$lib/server/content';
import homePinsDocument from '../content/home-pins.json';
import { parseHomePins } from '$lib/home-pins';

export function load() {
	return { latestRecords: contentSummaries(records.slice(0, 3)), works: contentSummaries(works.slice(0, 8)), homePins: parseHomePins(homePinsDocument) };
}
