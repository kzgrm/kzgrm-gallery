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
	// Width over height of the picture as it should be shown (16:9 → 1.78). Unset: the card's own 4:3.
	thumbnailAspect?: number;
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
