import assert from 'node:assert/strict';
import test from 'node:test';
import { layoutMobilePhotos, MOBILE_PHOTO_MAX_ANGLE } from '../src/lib/photo-layout.ts';

const epsilon = 1e-7;

function assertContained(layout, boardWidth) {
	for (const { bounds, scale } of layout.placements) {
		assert.ok(Number.isFinite(scale) && scale > 0 && scale <= 1);
		assert.ok(bounds.left >= -epsilon, `left ${bounds.left} outside board ${boardWidth}`);
		assert.ok(bounds.right <= boardWidth + epsilon, `right ${bounds.right} outside board ${boardWidth}`);
		assert.ok(bounds.top >= -epsilon);
		assert.ok(bounds.bottom <= layout.height + epsilon);
	}
	for (const [index, a] of layout.placements.entries()) {
		for (const b of layout.placements.slice(index + 1)) {
			const separated = a.bounds.right <= b.bounds.left + epsilon || b.bounds.right <= a.bounds.left + epsilon ||
				a.bounds.bottom <= b.bounds.top + epsilon || b.bounds.bottom <= a.bounds.top + epsilon;
			assert.ok(separated, 'occupied photo envelopes must not overlap');
		}
	}
}

test('empty and unmeasurable boards do not reserve phantom photo space', () => {
	assert.equal(layoutMobilePhotos(390, []).height, 0);
	for (const width of [0, -1, NaN, Infinity]) {
		assert.deepEqual(layoutMobilePhotos(width, [100]).placements, []);
		assert.equal(layoutMobilePhotos(width, [100]).height, 0);
	}
});

test('photos go to the shorter occupied column, with deterministic left-first ties', () => {
	const heights = [360, 90, 90, 90, 220, 160, 120];
	const layout = layoutMobilePhotos(390, heights);
	assert.deepEqual(layout, layoutMobilePhotos(390, heights));
	const bottoms = [0, 0];
	for (const photo of layout.placements) {
		assert.equal(photo.column, bottoms[0] <= bottoms[1] ? 0 : 1);
		bottoms[photo.column] = photo.bounds.bottom;
	}
	assert.deepEqual(layoutMobilePhotos(390, [100, 100, 100, 100]).placements.map((p) => p.column), [0, 1, 0, 1]);
});

test('mixed portrait/landscape cards, captions and failed-image heights fit at every mobile width', () => {
	for (const width of [1, 40, 180, 280, 320, 360, 390, 430, 620]) {
		for (const heights of [
			[1], [24, 24, 24], [700, 80, 450, 60, 130, 220, 90, 310, 170, 55],
			[90, 110, 130, 150, 170], [0, 1, NaN, Infinity, 32]
		]) {
			const layout = layoutMobilePhotos(width, heights);
			assert.equal(layout.placements.length, heights.length);
			assertContained(layout, width);
		}
	}
});

test('actual rotated corners and pins remain inside reserved bounds throughout the whole swing', () => {
	for (const boardWidth of [320, 390, 620]) {
		const heights = [80, 125, 240, 650, 48];
		const layout = layoutMobilePhotos(boardWidth, heights);
		for (const [index, placement] of layout.placements.entries()) {
			const width = layout.cardWidth;
			const corners = [[-width / 2, -2], [width / 2, -2], [-width / 2, heights[index] - 2], [width / 2, heights[index] - 2], [-9, -7], [9, -7], [-9, 10], [9, 10]];
			for (let angle = -MOBILE_PHOTO_MAX_ANGLE; angle <= MOBILE_PHOTO_MAX_ANGLE; angle += 0.25) {
				const radians = angle * Math.PI / 180;
				for (const [x, y] of corners) {
					const actualX = placement.left + width / 2 + placement.scale * (x * Math.cos(radians) - y * Math.sin(radians));
					const actualY = placement.top + 2 + placement.scale * (x * Math.sin(radians) + y * Math.cos(radians));
					assert.ok(actualX >= placement.bounds.left - epsilon && actualX <= placement.bounds.right + epsilon);
					assert.ok(actualY >= placement.bounds.top - epsilon && actualY <= placement.bounds.bottom + epsilon);
				}
			}
		}
	}
});

test('a delayed tall image or changed viewport recomputes the full occupied height', () => {
	const failed = layoutMobilePhotos(390, [24, 100, 24]);
	const loaded = layoutMobilePhotos(390, [600, 100, 350]);
	const narrow = layoutMobilePhotos(320, [600, 100, 350]);
	assert.ok(loaded.height > failed.height);
	assert.notDeepEqual(narrow, loaded);
	assertContained(loaded, 390);
	assertContained(narrow, 320);
});
