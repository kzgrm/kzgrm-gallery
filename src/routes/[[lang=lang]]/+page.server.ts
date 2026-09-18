import { contentSummaries, recordsFor, worksFor } from '$lib/server/content';
import homePinsDocument from '../../content/home-pins.json';
import { parseHomePins } from '$lib/home-pins';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const lang = params.lang === 'en' ? 'en' : 'ja';
	const records = recordsFor(lang);
	const works = worksFor(lang);
	return { latestRecords: contentSummaries(records.slice(0, 3)), works: contentSummaries(works.slice(0, 8)), homePins: parseHomePins(homePinsDocument) };
};
