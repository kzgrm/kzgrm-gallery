import assert from 'node:assert/strict';
import test from 'node:test';
import { parseHomePins, shuffledHomePins } from '../src/lib/home-pins.ts';

const photos = Array.from({ length: 10 }, (_, index) => {
	const id = index.toString(16).padStart(64, '0');
	return { id, src: `/home-pins/${id}.jpg`, alt: `写真 ${index}`, caption: '' };
});

test('home pins accept an incremental pool of up to ten valid unique photos', () => {
	assert.deepEqual(parseHomePins({ schemaVersion: 1, photos: [] }), []);
	assert.equal(parseHomePins({ schemaVersion: 1, photos: photos.slice(0, 1) }).length, 1);
	assert.equal(parseHomePins({ schemaVersion: 1, photos: photos.slice(0, 9) }).length, 9);
	assert.deepEqual(parseHomePins({ schemaVersion: 1, photos: [...photos.slice(0, 9), photos[0]] }), []);
	assert.equal(parseHomePins({ schemaVersion: 1, photos }).length, 10);
	assert.deepEqual(parseHomePins({ schemaVersion: 1, photos: [...photos, { ...photos[0], id: 'a'.repeat(64), src: `/home-pins/${'a'.repeat(64)}.jpg` }] }), []);
});

test('Fisher-Yates shuffles without losing photos', () => {
	const shuffled = shuffledHomePins(photos, () => 0);
	assert.notDeepEqual(shuffled.map((photo) => photo.id), photos.map((photo) => photo.id));
	assert.deepEqual(new Set(shuffled.map((photo) => photo.id)), new Set(photos.map((photo) => photo.id)));
});
