import { base } from '$app/paths';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { parse as parseYaml } from 'yaml';
import type { ContentKind, ContentSummary, Lang, PublicationState, SiteContent } from '$lib/types/content';
import { langPrefix } from '$lib/i18n';

type ContentFrontmatter = {
	title?: unknown;
	date?: unknown;
	kind?: unknown;
	tags?: unknown;
	thumbnail?: unknown;
	thumnail?: unknown;
	thumbnailUrl?: unknown;
	thumbnailFocus?: unknown;
	summary?: unknown;
	caption?: unknown;
	author?: unknown;
	externalUrl?: unknown;
	rail?: unknown;
	listed?: unknown;
	publicationState?: unknown;
};

const markdownModules = import.meta.glob('/src/content/**/index.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

// Localized siblings are optional. Missing entries and fields use Japanese content.
const localizedMarkdownModules = import.meta.glob('/src/content/**/index.{en,zh-TW,ko}.md', {
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

// Japanese index.md remains the canonical enumeration of entries.
const sourceByDirectory: Record<string, Partial<Record<Lang, string>>> = {};
for (const [localizedPath, source] of Object.entries(localizedMarkdownModules)) {
	const match = localizedPath.match(/^(.*)\/index\.(en|zh-TW|ko)\.md$/);
	if (!match) continue;
	(sourceByDirectory[match[1]] ??= {})[match[2] as Lang] = source;
}

// worksには個別ページが無い(リンクはexternalUrl頼み)。externalUrlの無い
// workのurlは旧activities URLからのリダイレクト先として一覧ページに落とす。
function routeFor(kind: ContentKind, slug: string, lang: Lang, externalUrl?: string): string {
	if (kind === 'work') return externalUrl ?? `${base}${langPrefix(lang)}/works/`;
	const collection = kind === 'record' ? 'records' : 'news';
	return `${base}${langPrefix(lang)}/${collection}/${encodeURIComponent(slug)}/`;
}

function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

// Merges the localized frontmatter over the Japanese original field-by-field, so an
// A localized index file only needs fields that change per language
// (title/summary/caption) and can omit date/kind/tags/thumbnail entirely.
function mergeAttributes(ja: ContentFrontmatter, localized: ContentFrontmatter | undefined): ContentFrontmatter {
	if (!localized) return ja;
	const merged: ContentFrontmatter = { ...ja };
	for (const [key, value] of Object.entries(localized)) {
		if (value !== undefined) (merged as Record<string, unknown>)[key] = value;
	}
	return merged;
}

// `thumbnailFocus` in the frontmatter: `top`, `center`, `bottom`, one percentage (how far down:
// `20%`) or two (across and down: `50% 20%`). Anything else means "not set" — the middle.
function focusOf(value: unknown): string | undefined {
	const text = typeof value === 'string' ? value.trim() : typeof value === 'number' ? `${value}%` : '';
	const named: Record<string, string> = { top: '50% 0%', center: '50% 50%', bottom: '50% 100%' };
	if (named[text]) return named[text];
	const match = /^(\d{1,3})%(?:\s+(\d{1,3})%)?$/.exec(text);
	if (!match || Number(match[1]) > 100 || Number(match[2] ?? 0) > 100) return undefined;
	return match[2] === undefined ? `50% ${match[1]}%` : `${match[1]}% ${match[2]}%`;
}

function readContent(path: string, source: string, lang: Lang): SiteContent {
	const { slug, directory, legacy } = contentLocation(path);
	const ja = splitDocument(source);
	const localizedSource = sourceByDirectory[directory]?.[lang];
	const localized = localizedSource ? splitDocument(localizedSource) : undefined;
	const attributes = mergeAttributes(ja.attributes, localized?.attributes);
	const body = localized ? localized.body : ja.body;

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
	const publicationState: PublicationState = attributes.publicationState === 'draft' || attributes.publicationState === 'unpublished' || attributes.publicationState === 'published'
		? attributes.publicationState
		: attributes.listed === false ? 'draft' : 'published';

	return {
		slug,
		title,
		date,
		dateLabel: formatDateLabel(date),
		kind,
		tags,
		thumbnail,
		thumbnailFocus: focusOf(attributes.thumbnailFocus),
		summary: optionalString(attributes.summary),
		caption: optionalString(attributes.caption),
		author: optionalString(attributes.author),
		externalUrl: optionalString(attributes.externalUrl),
		rail: attributes.rail === true,
		listed: publicationState === 'published' && attributes.listed !== false,
		publicationState,
		url: routeFor(kind, slug, lang, optionalString(attributes.externalUrl)),
		legacyUrl: legacy ? `${base}/activities/${encodeURIComponent(slug)}/` : undefined,
		html: safeHtml(body, directory)
	};
}

const contentsCache = new Map<Lang, SiteContent[]>();

export function contentsFor(lang: Lang): SiteContent[] {
	const cached = contentsCache.get(lang);
	if (cached) return cached;
	const built = Object.entries(markdownModules)
		.map(([path, source]) => readContent(path, source, lang))
		.sort((a, b) => b.date.localeCompare(a.date));
	contentsCache.set(lang, built);
	return built;
}

export const worksFor = (lang: Lang) => contentsFor(lang).filter((item) => item.kind === 'work' && item.listed);
export const recordsFor = (lang: Lang) => contentsFor(lang).filter((item) => item.kind === 'record' && item.listed);
export const newsFor = (lang: Lang) => contentsFor(lang).filter((item) => item.kind === 'news' && item.listed);
export const railNewsFor = (lang: Lang) => newsFor(lang).filter((item) => item.rail).slice(0, 3);

export const contentSummaries = (items: SiteContent[]): ContentSummary[] =>
	items.map(({ html: _html, ...item }) => item);

export function findContentFor(kind: ContentKind, slug: string, lang: Lang): SiteContent | undefined {
	return contentsFor(lang).find((item) => item.kind === kind && item.slug === slug && item.listed);
}

export function findAnyContentFor(slug: string, lang: Lang): SiteContent | undefined {
	return contentsFor(lang).find((item) => item.slug === slug && item.listed);
}

// Japanese-default aliases for callers that predate language support (the legacy
// /activities/* redirect route, which intentionally stays outside [[lang=lang]] —
// old external links to it never had a language prefix to begin with).
export const contents = contentsFor('ja');
export const works = worksFor('ja');
export const records = recordsFor('ja');
export const news = newsFor('ja');
export const railNews = railNewsFor('ja');
export const findContent = (kind: ContentKind, slug: string) => findContentFor(kind, slug, 'ja');
export const findAnyContent = (slug: string) => findAnyContentFor(slug, 'ja');
