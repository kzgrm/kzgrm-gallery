import { base } from '$app/paths';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { parse as parseYaml } from 'yaml';
import type { ContentKind, ContentSummary, SiteContent } from '$lib/types/content';

type ContentFrontmatter = {
	title?: unknown;
	date?: unknown;
	kind?: unknown;
	tags?: unknown;
	thumbnail?: unknown;
	thumnail?: unknown;
	thumbnailUrl?: unknown;
	summary?: unknown;
	caption?: unknown;
	author?: unknown;
	externalUrl?: unknown;
	rail?: unknown;
	listed?: unknown;
};

const markdownModules = import.meta.glob('/src/content/**/index.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const assetModules = import.meta.glob(
	'/src/content/**/*.{avif,gif,jpeg,jpg,png,svg,webp}',
	{
		eager: true,
		query: '?url',
		import: 'default'
	}
) as Record<string, string>;

function splitDocument(source: string): { attributes: ContentFrontmatter; body: string } {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) throw new Error('Content Markdown is missing YAML frontmatter.');
	return { attributes: parseYaml(match[1]) as ContentFrontmatter, body: match[2] };
}

function contentLocation(modulePath: string): { slug: string; directory: string; legacy: boolean } {
	const match = modulePath.match(/^\/src\/content\/(.+)\/index\.md$/);
	if (!match) throw new Error(`Unexpected content path: ${modulePath}`);
	const directory = `/src/content/${match[1]}`;
	const parts = match[1].split('/');
	return { slug: parts.at(-1) ?? match[1], directory, legacy: parts[0] === 'activities' };
}

function localAsset(directory: string, relativePath: string): string {
	const normalized = relativePath.replace(/^\.\//, '');
	const modulePath = `${directory}/${normalized}`;
	const asset = assetModules[modulePath];
	if (!asset) throw new Error(`Content asset not found: ${modulePath}`);
	return asset;
}

function rewriteMedia(markdown: string, directory: string): string {
	const withImages = markdown.replace(/(!\[[^\]]*\]\()\.\/([^\s)]+)(\))/g, (_match, before, file, after) => {
		return `${before}${localAsset(directory, file)}${after}`;
	});
	return withImages.replace(/(["'(])\.\.\/\.\.\/videos\//g, `$1${base}/videos/`);
}

function safeHtml(markdown: string, directory: string): string {
	const rendered = marked.parse(rewriteMedia(markdown, directory), {
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
	if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
	throw new Error(`Invalid content date in ${path}`);
}

function normalizeKind(value: unknown, path: string): ContentKind {
	if (value === 'work' || value === 'record' || value === 'news') return value;
	throw new Error(`Invalid content kind in ${path}`);
}

function formatDateLabel(date: string): string {
	const [year, month, day] = date.split('-').map(Number);
	return `${year}/${month}/${day}`;
}

function routeFor(kind: ContentKind, slug: string): string {
	const collection = kind === 'work' ? 'works' : kind === 'record' ? 'records' : 'news';
	return `${base}/${collection}/${encodeURIComponent(slug)}/`;
}

function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readContent(path: string, source: string): SiteContent {
	const { slug, directory, legacy } = contentLocation(path);
	const { attributes, body } = splitDocument(source);
	const title = typeof attributes.title === 'string' ? attributes.title : slug;
	const date = normalizeDate(attributes.date, path);
	const kind = normalizeKind(attributes.kind, path);
	const tags = Array.isArray(attributes.tags)
		? attributes.tags.filter((tag): tag is string => typeof tag === 'string')
		: [];
	const localThumbnail = attributes.thumbnail ?? attributes.thumnail;
	const remoteThumbnail = optionalString(attributes.thumbnailUrl);
	const thumbnail = typeof localThumbnail === 'string'
		? localAsset(directory, localThumbnail)
		: remoteThumbnail;

	return {
		slug,
		title,
		date,
		dateLabel: formatDateLabel(date),
		kind,
		tags,
		thumbnail,
		summary: optionalString(attributes.summary),
		caption: optionalString(attributes.caption),
		author: optionalString(attributes.author),
		externalUrl: optionalString(attributes.externalUrl),
		rail: attributes.rail === true,
		listed: attributes.listed !== false,
		url: routeFor(kind, slug),
		legacyUrl: legacy ? `${base}/activities/${encodeURIComponent(slug)}/` : undefined,
		html: safeHtml(body, directory)
	};
}

export const contents = Object.entries(markdownModules)
	.map(([path, source]) => readContent(path, source))
	.sort((a, b) => b.date.localeCompare(a.date));

export const works = contents.filter((item) => item.kind === 'work' && item.listed);
export const records = contents.filter((item) => item.kind === 'record' && item.listed);
export const news = contents.filter((item) => item.kind === 'news' && item.listed);
export const railNews = news.filter((item) => item.rail).slice(0, 3);

export const contentSummaries = (items: SiteContent[]): ContentSummary[] =>
	items.map(({ html: _html, ...item }) => item);

export function findContent(kind: ContentKind, slug: string): SiteContent | undefined {
	return contents.find((item) => item.kind === kind && item.slug === slug);
}

export function findAnyContent(slug: string): SiteContent | undefined {
	return contents.find((item) => item.slug === slug);
}
