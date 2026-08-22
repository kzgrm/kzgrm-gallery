import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export function renderPreviewMarkdown(markdown: string, assetBaseUrl = ''): string {
	const rewritten = assetBaseUrl
		? markdown.replace(/(!\[[^\]]*\]\()\.\/([^\s)]+)(\))/g, (_match, before, file, after) => `${before}${assetBaseUrl}/${encodeURIComponent(file)}${after}`)
		: markdown;
	const rendered = marked.parse(rewritten, { async: false, breaks: true, gfm: true }) as string;
	return sanitizeHtml(rendered, {
		allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'video', 'source'],
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			img: ['src', 'alt', 'title', 'loading', 'width', 'height'],
			video: ['src', 'controls', 'autoplay', 'loop', 'muted', 'playsinline', 'poster', 'preload'],
			source: ['src', 'type']
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		allowedSchemesByTag: { img: ['https'], video: ['https'], source: ['https'] }
	});
}
