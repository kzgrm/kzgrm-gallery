import { layoutMobilePhotos, mobilePhotoColumnWidth } from '../photo-layout';

// Progressive enhancement: SSR/no-JS keeps a normal two-column CSS grid. Once
// measured, the mobile board owns its card positions and its full occupied height.
export function mobilePhotoLayout(board: HTMLElement) {
	const mobile = window.matchMedia('(max-width:620px)');
	let frame = 0;
	let destroyed = false;
	let previousMeasurement = '';
	let observedFigures = new Set<HTMLElement>();

	function schedule() {
		if (!destroyed && !frame) frame = requestAnimationFrame(layout);
	}

	const resizeObserver = new ResizeObserver(schedule);
	resizeObserver.observe(board);

	function layout() {
		frame = 0;
		if (destroyed) return;
		if (!mobile.matches) {
			previousMeasurement = '';
			board.classList.remove('has-mobile-layout');
			delete board.dataset.mobileLayout;
			return;
		}
		const width = board.clientWidth;
		if (width <= 0) return;
		const figures = Array.from(board.querySelectorAll<HTMLElement>('figure[data-index]'));
		const currentFigures = new Set(figures);
		for (const figure of observedFigures) if (!currentFigures.has(figure)) resizeObserver.unobserve(figure);
		for (const figure of figures) if (!observedFigures.has(figure)) resizeObserver.observe(figure);
		observedFigures = currentFigures;
		board.style.setProperty('--mobile-card-width', `${mobilePhotoColumnWidth(width)}px`);
		board.classList.add('has-mobile-layout');
		const heights = figures.map((figure) => figure.offsetHeight);
		const measurement = `${width}:${heights.join(',')}`;
		if (measurement === previousMeasurement && board.dataset.mobileLayout === 'ready') return;
		previousMeasurement = measurement;
		const result = layoutMobilePhotos(width, heights);
		for (const [index, figure] of figures.entries()) {
			const placement = result.placements[index]!;
			figure.style.setProperty('--mobile-left', `${placement.left}px`);
			figure.style.setProperty('--mobile-top', `${placement.top}px`);
			figure.style.setProperty('--mobile-scale', String(placement.scale));
		}
		board.style.setProperty('--mobile-board-height', `${result.height}px`);
		board.dataset.mobileLayout = 'ready';
	}

	const mutationObserver = new MutationObserver(() => {
		previousMeasurement = '';
		schedule();
	});
	mutationObserver.observe(board, { childList: true });
	mobile.addEventListener('change', schedule);
	board.addEventListener('load', schedule, true);
	board.addEventListener('error', schedule, true);
	void document.fonts.ready.then(schedule);
	schedule();

	return {
		destroy() {
			destroyed = true;
			if (frame) cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			mobile.removeEventListener('change', schedule);
			board.removeEventListener('load', schedule, true);
			board.removeEventListener('error', schedule, true);
		}
	};
}
