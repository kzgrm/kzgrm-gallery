export type PendulumState = { angle: number; velocity: number };

const NATURAL_FREQUENCY = 5.2;
const DAMPING_RATIO = 0.2;
const WIND_IMPULSE = 80;
const MAX_VELOCITY = 140;

export function stepPendulum(state: PendulumState, elapsedSeconds: number): PendulumState {
	const dt = Math.min(Math.max(elapsedSeconds, 0), 0.032);
	const acceleration = -(NATURAL_FREQUENCY ** 2) * state.angle - 2 * DAMPING_RATIO * NATURAL_FREQUENCY * state.velocity;
	return {
		angle: state.angle + state.velocity * dt,
		velocity: state.velocity + acceleration * dt
	};
}

export function addWindImpulse(state: PendulumState, direction: -1 | 1, strength = 1): PendulumState {
	const velocity = state.velocity + direction * WIND_IMPULSE * Math.min(Math.max(strength, 0), 1.5);
	return { ...state, velocity: Math.min(Math.max(velocity, -MAX_VELOCITY), MAX_VELOCITY) };
}

export function pendulumIsAtRest(state: PendulumState): boolean {
	return Math.abs(state.angle) < 0.03 && Math.abs(state.velocity) < 0.08;
}
