import type { ContentSummary } from '$lib/types/content';

let railItem = $state<ContentSummary | null>(null);

export const homepagePreviewState = {
	get railItem() { return railItem; },
	set railItem(value: ContentSummary | null) { railItem = value; }
};
