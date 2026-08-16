import { error } from '@sveltejs/kit';
import { activities, findActivity } from '$lib/server/activities';

export function entries() {
	return activities.map(({ slug }) => ({ slug }));
}

export function load({ params }) {
	const activity = findActivity(params.slug);
	if (!activity) error(404, 'Activity not found');
	return { activity };
}
