export type Lang = 'ja' | 'en' | 'zh-TW' | 'ko';
export type ContentKind = 'work' | 'record' | 'news';
export type PublicationState = 'draft' | 'published' | 'unpublished';

export type ContentSummary = {
	slug: string;
	title: string;
	date: string;
	dateLabel: string;
	kind: ContentKind;
	tags: string[];
	thumbnail?: string;
	// Which part of the picture stays in view where it is cut to a frame's shape, as a CSS
	// position ("50% 20%"). Unset: the middle.
	thumbnailFocus?: string;
	summary?: string;
	caption?: string;
	author?: string;
	externalUrl?: string;
	rail: boolean;
	listed: boolean;
	publicationState: PublicationState;
	url: string;
	legacyUrl?: string;
};

export type SiteContent = ContentSummary & {
	html: string;
};
