// `chance` is optional: the percent chance (0.1-100) that this photo is on the board in one visit.
// Photos without it share whatever slots are left, as before. Set from kzgrm-compass's homepage page.
export type HomePinPhoto = { id: string; src: string; alt: string; caption: string; chance?: number };
export const minHomePinChance = 0.1, maxHomePinChance = 100;
// A photo this unlikely gets a gold frame on the board, so a visitor can tell they got a rare one.
export const ultraRareHomePinChance = 5;
export const isUltraRareHomePin = (photo: HomePinPhoto) => photo.chance !== undefined && photo.chance <= ultraRareHomePinChance;
export const validHomePinChance = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= minHomePinChance && value <= maxHomePinChance;

export const maxHomePinPhotos = 100;
export const displayedHomePinPhotos = 10;

const idPattern = /^[0-9a-f]{64}$/;
// WebP is what kzgrm-compass publishes now; .jpg stays valid for photos added before the switch.
const srcPattern = /^\/home-pins\/[0-9a-f]{64}\.(?:webp|jpg)$/;

export function parseHomePins(value: unknown): HomePinPhoto[] {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
	const document = value as { schemaVersion?: unknown; photos?: unknown };
	if (document.schemaVersion !== 1 || !Array.isArray(document.photos) || document.photos.length > maxHomePinPhotos) return [];
	const photos: HomePinPhoto[] = [];
	for (const candidate of document.photos) {
		if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return [];
		const photo = candidate as Record<string, unknown>;
		if (Object.keys(photo).some((key) => !['id', 'src', 'alt', 'caption', 'chance'].includes(key))) return [];
		if (typeof photo.id !== 'string' || !idPattern.test(photo.id) || typeof photo.src !== 'string' || !srcPattern.test(photo.src) || !photo.src.startsWith(`/home-pins/${photo.id}.`) || typeof photo.alt !== 'string' || photo.alt.length > 300 || typeof photo.caption !== 'string' || photo.caption.length > 120 || (photo.chance !== undefined && !validHomePinChance(photo.chance))) return [];
		photos.push({ id: photo.id, src: photo.src, alt: photo.alt, caption: photo.caption, ...(photo.chance === undefined ? {} : { chance: photo.chance }) });
	}
	return new Set(photos.map((photo) => photo.id)).size === photos.length ? photos : [];
}

export function shuffledHomePins(photos: readonly HomePinPhoto[], random = Math.random): HomePinPhoto[] {
	const result = [...photos];
	for (let index = result.length - 1; index > 0; index -= 1) {
		const swap = Math.floor(random() * (index + 1));
		[result[index], result[swap]] = [result[swap]!, result[index]!];
	}
	return result;
}

// One visit's board. A photo with a `chance` is rolled on its own first, so "1%" really means it is
// seen in about one visit out of a hundred (and "100%" means always). The photos without one then
// fill the remaining slots evenly. Only if that still leaves the board short (most of the pool has
// been given a chance) are the photos that lost their roll used to fill it, so the board stays full.
// The result is shuffled once more so a rare photo does not always sit in the first position.
export function selectedHomePins(photos: readonly HomePinPhoto[], random = Math.random): HomePinPhoto[] {
	const won: HomePinPhoto[] = [], lost: HomePinPhoto[] = [], ordinary: HomePinPhoto[] = [];
	for (const photo of photos) {
		if (photo.chance === undefined) ordinary.push(photo);
		else if (random() * 100 < photo.chance) won.push(photo);
		else lost.push(photo);
	}
	const selected = shuffledHomePins(won, random).slice(0, displayedHomePinPhotos);
	for (const pool of [ordinary, lost]) selected.push(...shuffledHomePins(pool, random).slice(0, displayedHomePinPhotos - selected.length));
	return shuffledHomePins(selected, random);
}
