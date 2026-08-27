import assert from 'node:assert/strict';
import test from 'node:test';
import { addWindImpulse, pendulumIsAtRest, stepPendulum } from '../src/lib/photo-motion.ts';

test('a resting photo receives directional angular velocity from header wind', () => {
	assert.deepEqual(addWindImpulse({ angle: 0, velocity: 0 }, -1), { angle: 0, velocity: -80 });
	assert.deepEqual(addWindImpulse({ angle: 0, velocity: 0 }, 1), { angle: 0, velocity: 80 });
});

test('right-to-left header wind uses clockwise velocity so a top-pinned photo moves left', () => {
	const rightToLeftDirection = 1;
	assert.equal(addWindImpulse({ angle: 0, velocity: 0 }, rightToLeftDirection).velocity, 80);
});

test('repeated gusts accumulate but stay within the safe velocity limit', () => {
	assert.equal(addWindImpulse({ angle: 0, velocity: 100 }, 1).velocity, 140);
	assert.equal(addWindImpulse({ angle: 0, velocity: -100 }, -1).velocity, -140);
});

test('the damped spring accelerates a displaced photo back toward rest', () => {
	const next = stepPendulum({ angle: 10, velocity: 0 }, 1 / 60);
	assert.equal(next.angle, 10);
	assert.ok(next.velocity < 0);
	assert.equal(pendulumIsAtRest({ angle: 0.01, velocity: 0.01 }), true);
	assert.equal(pendulumIsAtRest(next), false);
});
