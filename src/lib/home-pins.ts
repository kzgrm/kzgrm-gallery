export type HomePinPhoto = { id: string; src: string; alt: string; caption: string };

const idPattern = /^[0-9a-f]{64}$/;
const srcPattern = /^\/home-pins\/[0-9a-f]{64}\.jpg$/;

export function parseHomePins(value: unknown): HomePinPhoto[] {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
	const document = value as { schemaVersion?: unknown; photos?: unknown };
	if (document.schemaVersion !== 1 || !Array.isArray(document.photos) || document.photos.length !== 10) return [];
	const photos: HomePinPhoto[] = [];
	for (const candidate of document.photos) {
		if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return [];
		const photo = candidate as Record<string, unknown>;
		if (Object.keys(photo).some((key) => !['id', 'src', 'alt', 'caption'].includes(key))) return [];
		if (typeof photo.id !== 'string' || !idPattern.test(photo.id) || typeof photo.src !== 'string' || !srcPattern.test(photo.src) || typeof photo.alt !== 'string' || photo.alt.length > 300 || typeof photo.caption !== 'string' || photo.caption.length > 120) return [];
		photos.push({ id: photo.id, src: photo.src, alt: photo.alt, caption: photo.caption });
	}
	return new Set(photos.map((photo) => photo.id)).size === 10 ? photos : [];
}

export function shuffledHomePins(photos: readonly HomePinPhoto[], random = Math.random): HomePinPhoto[] {
	const result = [...photos];
	for (let index = result.length - 1; index > 0; index -= 1) {
		const swap = Math.floor(random() * (index + 1));
		[result[index], result[swap]] = [result[swap]!, result[index]!];
	}
	return result;
}
