export type ActivitySummary = {
	slug: string;
	title: string;
	date: string;
	dateLabel: string;
	tags: string[];
	thumbnail: string;
	url: string;
};

export type Activity = ActivitySummary & {
	html: string;
};
