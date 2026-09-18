import { base } from '$app/paths';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { parse as parseYaml } from 'yaml';
import type { ContentKind, ContentSummary, Lang, PublicationState, SiteContent } from '$lib/types/content';

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
	publicationState?: unknown;
};

const markdownModules = import.meta.glob('/src/content/**/index.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

// English siblings are optional per entry — content.ts falls back to the Japanese
// title/body/etc. field-by-field (see readContent) whenever no index.en.md exists,
// or whenever it exists but omits a given frontmatter key (date/kind/tags/thumbnail
// are rarely worth re-typing per language).
const markdownModulesEn = import.meta.glob('/src/content/**/index.en.md', {
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

// index.en.md files are looked up by directory, not slug, since the loader below still
// reads the Japanese index.md as the canonical enumeration of entries.
const enSourceByDirectory: Record<string, string> = {};
for (const enPath of Object.keys(markdownModulesEn)) {
	const directory = enPath.replace(/\/index\.en\.md$/, '');
	enSourceByDirectory[directory] = markdownModulesEn[enPath]!;
}

// worksには個別ページが無い(リンクはexternalUrl頼み)。externalUrlの無い
// workのurlは旧activities URLからのリダイレクト先として一覧ページに落とす。
function langPrefix(lang: Lang): string {
	return lang === 'en' ? `${base}/en` : base;
}

function routeFor(kind: ContentKind, slug: string, lang: Lang, externalUrl?: string): string {
	if (kind === 'work') return externalUrl ?? `${langPrefix(lang)}/works/`;
	const collection = kind === 'record' ? 'records' : 'news';
	return `${langPrefix(lang)}/${collection}/${encodeURIComponent(slug)}/`;
}

function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

// Merges the localized frontmatter over the Japanese original field-by-field, so an
// index.en.md only needs to carry the fields that actually change per language
// (title/summary/caption) and can omit date/kind/tags/thumbnail entirely.
function mergeAttributes(ja: ContentFrontmatter, en: ContentFrontmatter | undefined): ContentFrontmatter {
	if (!en) return ja;
	const merged: ContentFrontmatter = { ...ja };
	for (const [key, value] of Object.entries(en)) {
		if (value !== undefined) (merged as Record<string, unknown>)[key] = value;
	}
	return merged;
}

function readContent(path: string, source: string, lang: Lang): SiteContent {
	const { slug, directory, legacy } = contentLocation(path);
	const ja = splitDocument(source);
	const enSource = lang === 'en' ? enSourceByDirectory[directory] : undefined;
	const en = enSource ? splitDocument(enSource) : undefined;
	const attributes = mergeAttributes(ja.attributes, en?.attributes);
	const body = en ? en.body : ja.body;

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
