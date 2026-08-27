import assert from 'node:assert/strict';
import test from 'node:test';
import { addWindImpulse, getWindowMotionImpulse, pendulumIsAtRest, stepPendulum } from '../src/lib/photo-motion.ts';

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

test('window movement becomes a bounded directional impulse', () => {
	const right = getWindowMotionImpulse({ x: 100, y: 100 }, { x: 128, y: 100 });
	assert.equal(right?.direction, 1);
	assert.equal(right?.strength, 0.85);
	const vertical = getWindowMotionImpulse({ x: 100, y: 100 }, { x: 100, y: 128 });
	assert.equal(vertical?.direction, null);
	assert.ok(vertical.strength > 0);
	assert.equal(getWindowMotionImpulse({ x: 100, y: 100 }, { x: 101, y: 100 }), null);
	assert.equal(getWindowMotionImpulse({ x: 100, y: 100 }, { x: 900, y: 100 }), null);
});
