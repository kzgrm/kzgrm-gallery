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
