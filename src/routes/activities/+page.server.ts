import { activitySummaries } from '$lib/server/activities';

export function load() {
	return { activities: activitySummaries };
}
