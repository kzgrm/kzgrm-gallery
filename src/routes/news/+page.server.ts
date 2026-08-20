import { contentSummaries, news } from '$lib/server/content';

export function load() { return { news: contentSummaries(news) }; }
