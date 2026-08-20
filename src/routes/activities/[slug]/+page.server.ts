import { error, redirect } from '@sveltejs/kit';
import { contents, findAnyContent } from '$lib/server/content';

export function entries() {
	return contents.filter((item) => item.legacyUrl).map(({ slug }) => ({ slug }));
}

export function load({ params }) {
	const content = findAnyContent(params.slug);
	if (!content) error(404, 'Content not found');
	redirect(308, content.url);
}
