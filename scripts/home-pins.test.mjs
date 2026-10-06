import assert from 'node:assert/strict';
import test from 'node:test';
import { isUltraRareHomePin, maxHomePinPhotos, parseHomePins, selectedHomePins, shuffledHomePins } from '../src/lib/home-pins.ts';

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

test('home pins accept WebP and JPEG files named after their own id only', () => {
	const id = 'a'.repeat(64), other = 'b'.repeat(64);
	const pin = (src) => ({ schemaVersion: 1, photos: [{ id, src, alt: '', caption: '' }] });
	assert.equal(parseHomePins(pin(`/home-pins/${id}.webp`)).length, 1);
	assert.equal(parseHomePins(pin(`/home-pins/${id}.jpg`)).length, 1);
	assert.deepEqual(parseHomePins(pin(`/home-pins/${id}.png`)), []);
	assert.deepEqual(parseHomePins(pin(`/home-pins/${other}.webp`)), []);
	assert.deepEqual(parseHomePins(pin(`https://example.com/${id}.webp`)), []);
});

test('a photo with a chance is shown about that often, and the board stays full', () => {
	const pool = Array.from({ length: 22 }, (_, index) => {
		const id = index.toString(16).padStart(64, '0');
		return { id, src: `/home-pins/${id}.webp`, alt: '', caption: '' };
	});
	pool[0] = { ...pool[0], chance: 1 };
	pool[1] = { ...pool[1], chance: 100 };
	pool[2] = { ...pool[2], chance: 30 };
	// A small seeded generator keeps the test repeatable.
	let seed = 12345;
	const random = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
	const seen = [0, 0, 0, 0], visits = 20000;
	for (let visit = 0; visit < visits; visit += 1) {
		const selected = selectedHomePins(pool, random);
		assert.equal(selected.length, 10);
		assert.equal(new Set(selected.map((photo) => photo.id)).size, 10);
		for (const index of [0, 1, 2, 3]) if (selected.some((photo) => photo.id === pool[index].id)) seen[index] += 1;
	}
	assert.ok(Math.abs(seen[0] / visits - 0.01) < 0.004, `1% photo was seen ${seen[0]} times`);
	assert.equal(seen[1], visits);
	assert.ok(Math.abs(seen[2] / visits - 0.3) < 0.02, `30% photo was seen ${seen[2]} times`);
	// 19 ordinary photos share the slots the rolled ones left: about (10 - 1 - 0.3 - 0.01) / 19.
	assert.ok(Math.abs(seen[3] / visits - 8.69 / 19) < 0.02, `ordinary photo was seen ${seen[3]} times`);
});

test('a pool where every photo has a chance still fills the board', () => {
	const pool = Array.from({ length: 12 }, (_, index) => {
		const id = index.toString(16).padStart(64, '0');
		return { id, src: `/home-pins/${id}.webp`, alt: '', caption: '', chance: 5 };
	});
	assert.equal(selectedHomePins(pool, () => 0.99).length, 10);
	assert.equal(selectedHomePins(pool, () => 0).length, 10);
});

test('home pins accept a chance between 0.1 and 100 only', () => {
	const id = 'c'.repeat(64);
	const pin = (chance) => ({ schemaVersion: 1, photos: [{ id, src: `/home-pins/${id}.webp`, alt: '', caption: '', chance }] });
	assert.equal(parseHomePins(pin(1))[0].chance, 1);
	assert.equal(parseHomePins(pin(0.1))[0].chance, 0.1);
	assert.equal(parseHomePins(pin(100))[0].chance, 100);
	for (const bad of [0, 0.05, 101, -1, '10', null, Number.NaN]) assert.deepEqual(parseHomePins(pin(bad)), []);
});

test('only a photo with a chance of 5% or less counts as ultra rare', () => {
	const photo = (chance) => ({ id: 'd'.repeat(64), src: '', alt: '', caption: '', ...(chance === undefined ? {} : { chance }) });
	assert.equal(isUltraRareHomePin(photo(1)), true);
	assert.equal(isUltraRareHomePin(photo(5)), true);
	assert.equal(isUltraRareHomePin(photo(5.1)), false);
	assert.equal(isUltraRareHomePin(photo(100)), false);
	assert.equal(isUltraRareHomePin(photo(undefined)), false);
});
