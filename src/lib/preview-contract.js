export const previewMessageType = 'kzgrm.homepage-preview/v1';
const contentKeys = ['assetBaseUrl', 'author', 'body', 'caption', 'date', 'externalUrl', 'kind', 'rail', 'slug', 'summary', 'tags', 'thumbnailUrl', 'title'];

/** @param {Record<string, unknown>} value @param {string[]} expected */
const exactKeys = (value, expected) => {
	const keys = Object.keys(value).sort();
	return keys.length === expected.length && keys.every((key, index) => key === expected[index]);
};
/** @param {unknown} value @param {number} max @param {boolean} required */
const line = (value, max, required = false) => typeof value === 'string' && value.length <= max && (!required || (value.length > 0 && value.trim() === value)) && !/[\r\n\u0000-\u001f\u007f]/.test(value);
/** @param {unknown} value */
const validDate = (value) => {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const [year, month, day] = value.split('-').map(Number), parsed = new Date(`${value}T00:00:00Z`);
	return parsed.getUTCFullYear() === year && parsed.getUTCMonth() + 1 === month && parsed.getUTCDate() === day;
};
/** @param {unknown} value @param {boolean} httpsOnly */
const webUrl = (value, httpsOnly = false) => {
	if (value === '') return true;
	if (typeof value !== 'string' || value.length > 2048) return false;
	try { const protocol = new URL(value).protocol; return protocol === 'https:' || (!httpsOnly && protocol === 'http:'); }
	catch { return false; }
};
/** @param {unknown} value */
const thumbnail = (value) => value === '' || webUrl(value, true) || (typeof value === 'string' && value.length <= 22 * 1024 * 1024 && /^data:image\/(?:jpeg|png|webp|gif|heic|heif);base64,[A-Za-z0-9+/=]+$/.test(value));

/** @param {unknown} value */
export function validPreviewToken(value) {
	return typeof value === 'string' && /^[0-9a-f]{32,128}$/.test(value);
}

/** @param {unknown} value @param {string} expectedToken */
export function decodePreviewMessage(value, expectedToken) {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
	const message = /** @type {Record<string, unknown>} */ (value);
	if (!exactKeys(message, ['content', 'token', 'type']) || message.type !== previewMessageType || message.token !== expectedToken || !validPreviewToken(expectedToken)) return null;
	if (!message.content || typeof message.content !== 'object' || Array.isArray(message.content)) return null;
	const content = /** @type {Record<string, unknown>} */ (message.content);
	if (!exactKeys(content, contentKeys)) return null;
	if (typeof content.slug !== 'string' || !line(content.slug, 200, true) || /[\\/]/.test(content.slug) || content.slug === '.' || content.slug === '..') return null;
	if (!line(content.title, 160, true) || !validDate(content.date) || typeof content.kind !== 'string' || !['work', 'record', 'news'].includes(content.kind)) return null;
	if (!Array.isArray(content.tags) || content.tags.length > 12 || content.tags.some((tag) => !line(tag, 40, true)) || new Set(content.tags).size !== content.tags.length) return null;
	if (!line(content.summary, 500) || !line(content.caption, 120) || !line(content.author, 120)) return null;
	if (!webUrl(content.externalUrl) || typeof content.rail !== 'boolean' || typeof content.body !== 'string' || content.body.length > 128 * 1024 || content.body.includes('\r')) return null;
	if (!thumbnail(content.thumbnailUrl) || !webUrl(content.assetBaseUrl, true)) return null;
	return content;
}
