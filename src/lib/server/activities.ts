import { base } from '$app/paths';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { parse as parseYaml } from 'yaml';
import type { Activity, ActivitySummary } from '$lib/types/activity';

type ActivityFrontmatter = {
	title?: unknown;
	date?: unknown;
	tags?: unknown;
	thumnail?: unknown;
	thumbnail?: unknown;
};

const markdownModules = import.meta.glob('/src/content/activities/**/index.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const assetModules = import.meta.glob(
	'/src/content/activities/**/*.{avif,gif,jpeg,jpg,png,svg,webp}',
	{
		eager: true,
		query: '?url',
		import: 'default'
	}
) as Record<string, string>;

function splitDocument(source: string): { attributes: ActivityFrontmatter; body: string } {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) throw new Error('Activity Markdown is missing YAML frontmatter.');

	return {
		attributes: parseYaml(match[1]) as ActivityFrontmatter,
		body: match[2]
	};
}

function activitySlug(modulePath: string): string {
	const match = modulePath.match(/^\/src\/content\/activities\/(.+)\/index\.md$/);
	if (!match) throw new Error(`Unexpected activity path: ${modulePath}`);
	return match[1];
}

function activityAsset(slug: string, relativePath: string): string {
	const normalized = relativePath.replace(/^\.\//, '');
	const modulePath = `/src/content/activities/${slug}/${normalized}`;
	const asset = assetModules[modulePath];
	if (!asset) throw new Error(`Activity asset not found: ${modulePath}`);
	return asset;
}

function rewriteMedia(markdown: string, slug: string): string {
	const withImages = markdown.replace(/(!\[[^\]]*\]\()\.\/([^\s)]+)(\))/g, (_match, before, file, after) => {
		return `${before}${activityAsset(slug, file)}${after}`;
	});

	return withImages.replace(/(["'(])\.\.\/\.\.\/videos\//g, `$1${base}/videos/`);
}

function safeHtml(markdown: string, slug: string): string {
	const rendered = marked.parse(rewriteMedia(markdown, slug), {
		async: false,
		breaks: true,
		gfm: true
	}) as string;

	return sanitizeHtml(rendered, {
		allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'video', 'source'],
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			img: ['src', 'alt', 'title', 'loading', 'width', 'height'],
			video: ['src', 'controls', 'autoplay', 'loop', 'muted', 'playsinline', 'poster', 'preload'],
			source: ['src', 'type']
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		allowedSchemesByTag: {
			img: ['http', 'https'],
			video: ['http', 'https'],
			source: ['http', 'https']
		}
	});
}

function normalizeDate(value: unknown, path: string): string {
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10);
	}
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
	throw new Error(`Invalid activity date in ${path}`);
}

function formatDateLabel(date: string): string {
	const [year, month, day] = date.split('-').map(Number);
	return `${year}/${month}/${day}`;
}

function readActivity(path: string, source: string): Activity {
	const slug = activitySlug(path);
	const { attributes, body } = splitDocument(source);
	const title = typeof attributes.title === 'string' ? attributes.title : slug;
	const date = normalizeDate(attributes.date, path);
	const tags = Array.isArray(attributes.tags)
		? attributes.tags.filter((tag): tag is string => typeof tag === 'string')
		: [];
	const thumbnailPath = attributes.thumbnail ?? attributes.thumnail;
	if (typeof thumbnailPath !== 'string') throw new Error(`Activity thumbnail is missing in ${path}`);

	return {
		slug,
		title,
		date,
		dateLabel: formatDateLabel(date),
		tags,
		thumbnail: activityAsset(slug, thumbnailPath),
		html: safeHtml(body, slug),
		url: `${base}/activities/${slug}/`
	};
}

export const activities = Object.entries(markdownModules)
	.map(([path, source]) => readActivity(path, source))
	.sort((a, b) => b.date.localeCompare(a.date));

export const activitySummaries: ActivitySummary[] = activities.map(({ html: _html, ...activity }) => activity);

export function findActivity(slug: string): Activity | undefined {
	return activities.find((activity) => activity.slug === slug);
}
