// Fires onLoaded once the image is actually ready to show, whether that's a
// real load/error event or the browser already having it (SSR markup that
// was already complete before this action ran, e.g. from cache).
export function trackImageLoad(img: HTMLImageElement, onLoaded: () => void) {
	if (img.complete) {
		onLoaded();
		return;
	}
	const handle = () => onLoaded();
	img.addEventListener('load', handle);
	img.addEventListener('error', handle);
	return {
		destroy() {
			img.removeEventListener('load', handle);
			img.removeEventListener('error', handle);
		}
	};
}
