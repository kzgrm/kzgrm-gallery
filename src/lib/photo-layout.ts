// A top-pinned photo may move inside this envelope without changing the layout.
// Keep the mobile pendulum clamp in PinnedPhotoBoard in sync with this limit.
export const MOBILE_PHOTO_MAX_ANGLE = 7;

const EDGE = 8;
const GAP = 12;
const SHADOW = 8;
const PIN_HALF_WIDTH = 9;
const ORIGIN_Y = 2;

export function mobilePhotoColumnWidth(boardWidth: number): number {
	if (!Number.isFinite(boardWidth) || boardWidth <= 0) return 0;
	const edge = Math.min(EDGE, boardWidth / 12);
	const gap = Math.min(GAP, boardWidth / 12);
	return (boardWidth - edge * 2 - gap) / 2;
}

type Bounds = { left: number; top: number; right: number; bottom: number };

// Find the extrema of every corner throughout the whole swing, including angles
// between the end points (the bottom of a tall card can peak before the limit).
function swingBounds(width: number, height: number): Bounds {
	const limit = MOBILE_PHOTO_MAX_ANGLE * Math.PI / 180;
	const bounds: Bounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
	const corners: [number, number][] = [
		[-width / 2, -ORIGIN_Y], [width / 2, -ORIGIN_Y],
		[-width / 2, height - ORIGIN_Y], [width / 2, height - ORIGIN_Y],
		[-PIN_HALF_WIDTH, -7], [PIN_HALF_WIDTH, -7],
		[-PIN_HALF_WIDTH, 10], [PIN_HALF_WIDTH, 10]
	];
	for (const [x, y] of corners) {
		const angles = [-limit, 0, limit];
		for (const critical of [Math.atan2(-y, x), Math.atan2(x, y)]) {
			for (const turn of [-Math.PI, 0, Math.PI]) {
				const angle = critical + turn;
				if (angle >= -limit && angle <= limit) angles.push(angle);
			}
		}
		for (const angle of angles) {
			const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
			const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
			bounds.left = Math.min(bounds.left, rotatedX);
			bounds.right = Math.max(bounds.right, rotatedX);
			bounds.top = Math.min(bounds.top, rotatedY);
			bounds.bottom = Math.max(bounds.bottom, rotatedY);
		}
	}
	return bounds;
}

export type MobilePhotoPlacement = {
	column: number;
	left: number;
	top: number;
	scale: number;
	// Occupied rectangle includes the entire swing, pin and shadow allowance.
	bounds: Bounds;
};

export function layoutMobilePhotos(boardWidth: number, measuredHeights: number[]) {
	const cardWidth = mobilePhotoColumnWidth(boardWidth);
	if (cardWidth === 0 || measuredHeights.length === 0) return { cardWidth, height: 0, placements: [] as MobilePhotoPlacement[] };
	const edge = Math.min(EDGE, boardWidth / 12);
	const gap = Math.min(GAP, boardWidth / 12);
	const shadow = Math.min(SHADOW, cardWidth / 8);
	const bottoms = [edge, edge];
	const placements = measuredHeights.map((measuredHeight): MobilePhotoPlacement => {
		const height = Number.isFinite(measuredHeight) ? Math.max(1, measuredHeight) : 1;
		const envelope = swingBounds(cardWidth, height);
		const scale = Math.min(1, (cardWidth - shadow * 2) / (envelope.right - envelope.left));
		const column = bottoms[0]! <= bottoms[1]! ? 0 : 1;
		const center = edge + column * (cardWidth + gap) + cardWidth / 2;
		const pivotTop = bottoms[column]! + shadow - envelope.top * scale;
		const bounds = {
			left: center + envelope.left * scale - shadow,
			top: bottoms[column]!,
			right: center + envelope.right * scale + shadow,
			bottom: pivotTop + envelope.bottom * scale + shadow
		};
		bottoms[column] = bounds.bottom + gap;
		return { column, left: center - cardWidth / 2, top: pivotTop - ORIGIN_Y, scale, bounds };
	});
	return { cardWidth, height: Math.max(...bottoms) - gap + edge, placements };
}
