import { activitySummaries } from '$lib/server/activities';

export function load() {
	return { latest: activitySummaries.slice(0, 3) };
}
