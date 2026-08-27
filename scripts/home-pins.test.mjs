import assert from 'node:assert/strict';
import test from 'node:test';
import { maxHomePinPhotos, parseHomePins, selectedHomePins, shuffledHomePins } from '../src/lib/home-pins.ts';

const photos = Array.from({ length: 10 }, (_, index) => {
	const id = index.toString(16).padStart(64, '0');
	return { id, src: `/home-pins/${id}.jpg`, alt: `写真 ${index}`, caption: '' };
});

test('home pins accept an incremental pool of up to the configured limit', () => {
	assert.deepEqual(parseHomePins({ schemaVersion: 1, photos: [] }), []);
	assert.equal(parseHomePins({ schemaVersion: 1, photos: photos.slice(0, 1) }).length, 1);
	assert.equal(parseHomePins({ schemaVersion: 1, photos: photos.slice(0, 9) }).length, 9);
	assert.deepEqual(parseHomePins({ schemaVersion: 1, photos: [...photos.slice(0, 9), photos[0]] }), []);
	assert.equal(parseHomePins({ schemaVersion: 1, photos }).length, 10);
	const largePool = Array.from({ length: maxHomePinPhotos }, (_, index) => {
		const id = (index + 100).toString(16).padStart(64, '0');
		return { id, src: `/home-pins/${id}.jpg`, alt: '', caption: '' };
	});
	assert.equal(parseHomePins({ schemaVersion: 1, photos: largePool }).length, maxHomePinPhotos);
	assert.deepEqual(parseHomePins({ schemaVersion: 1, photos: [...largePool, photos[0]] }), []);
});

test('selection returns ten unique photos from a larger pool', () => {
	const pool = Array.from({ length: 22 }, (_, index) => {
		const id = index.toString(16).padStart(64, '0');
		return { id, src: `/home-pins/${id}.jpg`, alt: '', caption: '' };
	});
	const selected = selectedHomePins(pool, () => 0);
	assert.equal(selected.length, 10);
	assert.equal(new Set(selected.map((photo) => photo.id)).size, 10);
	assert.ok(selected.some((photo) => !photos.some((original) => original.id === photo.id)));
});

test('Fisher-Yates shuffles without losing photos', () => {
	const shuffled = shuffledHomePins(photos, () => 0);
	assert.notDeepEqual(shuffled.map((photo) => photo.id), photos.map((photo) => photo.id));
	assert.deepEqual(new Set(shuffled.map((photo) => photo.id)), new Set(photos.map((photo) => photo.id)));
});
