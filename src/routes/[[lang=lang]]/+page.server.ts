import { contentSummaries, recordsFor, worksFor } from '$lib/server/content';
import homePinsDocument from '../../content/home-pins.json';
import { parseHomePins } from '$lib/home-pins';
import type { PageServerLoad } from './$types';
import { parseLang } from '$lib/i18n';

export const load: PageServerLoad = ({ params }) => {
	const lang = parseLang(params.lang);
	const records = recordsFor(lang);
	const works = worksFor(lang);
	return { latestRecords: contentSummaries(records.slice(0, 3)), works: contentSummaries(works.slice(0, 8)), homePins: parseHomePins(homePinsDocument) };
};
