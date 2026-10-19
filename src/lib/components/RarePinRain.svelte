<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	// 激レア（金の縁）の写真が出たときの演出「風下の雨」。風下の写真・ロゴの文字・風車が上から降り、
	// だんだん増えて画面を覆いきったら、増えたときより速いペースで減って終わる。覆いきった瞬間に、雨の後ろで
	// 金の写真の場所を知らせる（画面の中なら写真を指す矢印、画面の外なら画面下の札）。
	// 数値は kzgrm-design-studio の Workbench「風下の雨」（#rare-pin-rain）と同じ。
	let { target, photoSources, label }: { target: HTMLElement; photoSources: string[]; label: string } = $props();

	const RISE = 6; // 秒。この間に増えて、画面を覆いきる
	const START_RATE = 1.5; // 個/秒
	const PEAK_RATE = 170; // 数を抑えて、そのぶん1個を大きくする（同じ場所を何重にも塗らないため）
	const GROWTH = Math.log(PEAK_RATE / START_RATE) / RISE;
	const DECAY = GROWTH * 3; // 減るときは増えたときの3倍の速さ（約2秒で止む）
	const FALL = Math.log(PEAK_RATE / START_RATE) / DECAY;
	const POINTER_SECONDS = 4; // 矢印は、雨が止んでから（雨の後に写真が見えたならその時から）この秒数で消える
	const MAX_PIXEL_RATIO = 1.5; // 高精細な画面でも、これより細かくは描かない（素材が320pxなので見た目は変わらない）
	const MIN_PIXEL_SCALE = 0.55; // 描画が追いつかない端末では、ここまで細かさを下げる
	const MAX_PIECES = 240; // 横長の画面で同時に出しておく数の上限（縦長の画面では面積に合わせて増やす）
	const PHOTO_SPRITE = 320; // 写真は長い辺をこの大きさに縮めてから焼く
	const letterNames = ['ka', 'za', 'gu', 'ru', 'ma'];

	type Kind = 'photo' | 'letter' | 'symbol';
	type Sprite = HTMLCanvasElement | ImageBitmap;
	type Piece = { kind: Kind; image: Sprite; x: number; y: number; vx: number; vy: number; angle: number; spin: number; size: number; sway: number; phase: number };
	type Pointer = { left: number; top: number; direction: 'left' | 'right' | 'down' };

	let canvas = $state<HTMLCanvasElement>();
	// 'arrow' = 写真が画面の中にある、'below'/'above' = 画面の外にある（札で知らせる）
	let pointer = $state<'arrow' | 'below' | 'above' | null>(null);
	let arrow = $state<Pointer | null>(null);
	let raining = false;
	let targetVisible = false;
	let photos: Sprite[] = [];
	let letters: Sprite[] = [];
	let symbol: Sprite;
	let frame = 0;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	const load = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = src;
	});
	const between = (low: number, high: number) => low + Math.random() * (high - low);

	async function toSprite(canvas: HTMLCanvasElement): Promise<Sprite> {
		try { return await createImageBitmap(canvas); } catch { return canvas; }
	}

	function bake(image: HTMLImageElement, longSide: number) {
		const scale = longSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height);
		const canvas = document.createElement('canvas');
		canvas.width = Math.round((image.naturalWidth || image.width) * scale);
		canvas.height = Math.round((image.naturalHeight || image.height) * scale);
		canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
		return toSprite(canvas);
	}

	// 写真ボードと同じ、生成りの台紙で下が少し広い余白。影も一緒に焼く
	function bakePhoto(image: HTMLImageElement) {
		const scale = Math.min(1, PHOTO_SPRITE / Math.max(image.naturalWidth, image.naturalHeight));
		const w = Math.round(image.naturalWidth * scale), h = Math.round(image.naturalHeight * scale), longSide = Math.max(w, h);
		const pad = longSide * 0.05, shadowX = longSide * 0.02, shadowY = longSide * 0.035;
		const paperW = w + pad * 2, paperH = h + pad * 3.2;
		const canvas = document.createElement('canvas');
		canvas.width = Math.ceil(paperW + shadowX);
		canvas.height = Math.ceil(paperH + shadowY);
		const context = canvas.getContext('2d')!;
		context.fillStyle = 'rgba(40,48,74,.22)';
		context.fillRect(shadowX, shadowY, paperW, paperH);
		context.fillStyle = '#fffdf6';
		context.fillRect(0, 0, paperW, paperH);
		context.drawImage(image, pad, pad, w, h);
		return toSprite(canvas);
	}

	function spawn(width: number, height: number, grow: number): Piece {
		const unit = Math.min(width, height);
		const roll = Math.random();
		const kind: Kind = roll < 0.55 && photos.length ? 'photo' : roll < 0.85 ? 'letter' : 'symbol';
		const image = kind === 'photo' ? photos[Math.floor(Math.random() * photos.length)] : kind === 'letter' ? letters[Math.floor(Math.random() * letters.length)] : symbol;
		const size = unit * grow * (kind === 'photo' ? between(0.18, 0.27) : kind === 'letter' ? between(0.1, 0.17) : between(0.09, 0.16));
		// 写真はゆっくり傾き、文字と風車はくるくる回る
		const spin = (Math.random() < 0.5 ? -1 : 1) * (kind === 'photo' ? between(0.3, 1.2) : between(1.8, 4.2));
		return { kind, image, x: between(-0.08, 1.08) * width, y: -size, vx: between(-0.04, 0.04) * width, vy: between(0.35, 0.6) * height, angle: between(-0.5, 0.5), spin, size, sway: between(0.01, 0.03) * width, phase: between(0, Math.PI * 2) };
	}

	// save/restore を使わず、位置と回転を1回で指定して、焼いた絵を1枚置くだけ
	function draw(context: CanvasRenderingContext2D, piece: Piece, time: number, ratio: number) {
		const { image, size } = piece;
		const cos = Math.cos(piece.angle) * ratio, sin = Math.sin(piece.angle) * ratio;
		context.setTransform(cos, sin, -sin, cos, (piece.x + Math.sin(time * 2 + piece.phase) * piece.sway) * ratio, piece.y * ratio);
		const scale = size / Math.max(image.width, image.height);
		const w = image.width * scale, h = image.height * scale;
		context.drawImage(image, -w / 2, -h / 2, w, h);
	}

	// 増える → 覆いきる → 増えたときより速く減る → 降っているものが落ちきって終わる
	function rateAt(time: number) {
		if (time < RISE) return START_RATE * Math.exp(GROWTH * time);
		if (time < RISE + FALL) return PEAK_RATE * Math.exp(-DECAY * (time - RISE));
		return 0;
	}

	function rain() {
		if (!canvas) return;
		const view = canvas;
		const context = view.getContext('2d')!;
		const pieces: Piece[] = [];
		let started = 0, last = 0, owed = 1; // 1つ目はすぐ落とす
		let quality = 1, slowFrame = 16; // 描画が遅れたら細かさを下げる（その再生の間は戻さない）
		raining = true;

		const tick = (now: number) => {
			const width = view.clientWidth, height = view.clientHeight;
			if (!started) { started = now; last = now; }
			const time = (now - started) / 1000, dt = Math.min(0.05, (now - last) / 1000);
			slowFrame = slowFrame * 0.8 + (now - last) * 0.2;
			if (slowFrame > 22 && quality > MIN_PIXEL_SCALE) { quality = Math.max(MIN_PIXEL_SCALE, quality * 0.85); slowFrame = 16; }
			last = now;
			const ratio = Math.min(devicePixelRatio || 1, MAX_PIXEL_RATIO) * quality;
			if (view.width !== Math.round(width * ratio) || view.height !== Math.round(height * ratio)) {
				view.width = Math.round(width * ratio);
				view.height = Math.round(height * ratio);
			}
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			context.clearRect(0, 0, width, height);
			// 縦長の画面ほど、短い辺に合わせた1個あたりの面積に対して画面が広いので、そのぶん多く降らせる
			const coverage = Math.max(1, (width * height) / Math.min(width, height) ** 2 / 1.6);
			owed += rateAt(time) * coverage * dt;
			const grow = 1 + 1.1 * Math.min(1, time / RISE) ** 2;
			for (; owed >= 1; owed--) if (pieces.length < MAX_PIECES * coverage) pieces.push(spawn(width, height, grow));
			// 落ちきったものを外す。並び順が描く順（後ろほど手前）なので、順番は崩さずに詰める
			let kept = 0;
			for (const piece of pieces) {
				piece.vy += height * 0.9 * dt;
				piece.x += piece.vx * dt;
				piece.y += piece.vy * dt;
				piece.angle += piece.spin * dt;
				if (piece.y - piece.size <= height) pieces[kept++] = piece;
			}
			pieces.length = kept;
			for (const piece of pieces) draw(context, piece, time, ratio);
			// 覆いきった瞬間に、雨の後ろへ案内を出す
			if (time >= RISE && pointer === null) showPointer();
			if (time > RISE + FALL && pieces.length === 0) {
				raining = false;
				context.setTransform(1, 0, 0, 1, 0, 0);
				context.clearRect(0, 0, view.width, view.height);
				if (pointer === 'arrow') scheduleHide();
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	// 写真ボードは幅620px以下でページの下へ回るので、スマホでは写真の上から下向きに指す
	function placeArrow() {
		const rect = target.getBoundingClientRect();
		if (innerWidth <= 620) arrow = { left: rect.left + rect.width / 2, top: rect.top, direction: 'down' };
		else if (rect.left + rect.width / 2 > innerWidth / 2) arrow = { left: rect.left, top: rect.top + rect.height * 0.45, direction: 'right' };
		else arrow = { left: rect.right, top: rect.top + rect.height * 0.45, direction: 'left' };
	}

	function showPointer() {
		const rect = target.getBoundingClientRect();
		if (targetVisible) { pointer = 'arrow'; placeArrow(); }
		else pointer = rect.top < 0 ? 'above' : 'below';
	}

	function scheduleHide() {
		clearTimeout(hideTimer);
		hideTimer = setTimeout(() => { pointer = null; arrow = null; }, POINTER_SECONDS * 1000);
	}

	function goToPhoto() {
		target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
	}

	onMount(() => {
		let cancelled = false;
		// 札が出ているあいだに写真が画面に入ったら、札を消して矢印に替える
		const observer = new IntersectionObserver(([entry]) => {
			targetVisible = entry.isIntersecting;
			if (targetVisible && (pointer === 'below' || pointer === 'above')) {
				pointer = 'arrow';
				placeArrow();
				if (!raining) scheduleHide();
			}
		}, { threshold: 0.6 });
		observer.observe(target);
		const follow = () => { if (pointer === 'arrow') placeArrow(); };
		addEventListener('scroll', follow, { passive: true });
		addEventListener('resize', follow);

		(async () => {
			const [photoImages, letterImages, symbolImage] = await Promise.all([
				Promise.all(photoSources.map((src) => load(src).catch(() => null))),
				Promise.all(letterNames.map((name) => load(`${base}/rare-rain/${name}.png`))),
				load(`${base}/favicon.svg`),
			]);
			[photos, letters, symbol] = await Promise.all([
				Promise.all(photoImages.filter((image): image is HTMLImageElement => image !== null).map(bakePhoto)),
				Promise.all(letterImages.map((image) => bake(image, 220))),
				bake(symbolImage, 240),
			]);
			if (cancelled) return;
			// 動きを減らす設定の人には雨を流さず、案内だけ出す
			if (matchMedia('(prefers-reduced-motion: reduce)').matches) { showPointer(); if (pointer === 'arrow') scheduleHide(); }
			else rain();
		})().catch(() => {});

		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
			clearTimeout(hideTimer);
			observer.disconnect();
			removeEventListener('scroll', follow);
			removeEventListener('resize', follow);
		};
	});
</script>

<canvas class="rare-rain" bind:this={canvas} aria-hidden="true"></canvas>
{#if pointer === 'arrow' && arrow}
	<div class="rare-arrow {arrow.direction}" style={`left:${arrow.left}px;top:${arrow.top}px`} role="status">
		<span class="rare-label">{label}</span>
		{#if arrow.direction === 'down'}
			<svg viewBox="0 0 40 64" aria-hidden="true"><path d="M12 2h16v34h10L20 62 2 36h10z" /></svg>
		{:else}
			<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M2 12h34V2l26 18-26 18V28H2z" /></svg>
		{/if}
	</div>
{:else if pointer === 'below' || pointer === 'above'}
	<button type="button" class="rare-badge" class:above={pointer === 'above'} onclick={goToPhoto}>
		<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M12 2h16v24h10L20 46 2 26h10z" /></svg>
		<span>{label}</span>
	</button>
{/if}

<style>
	/* 案内は雨の後ろ。雨が止むにつれて見えてくる */
	.rare-rain { position: fixed; inset: 0; z-index: 1001; width: 100%; height: 100%; pointer-events: none; }
	.rare-arrow { position: fixed; z-index: 1000; display: flex; flex-direction: column; align-items: center; gap: .2rem; pointer-events: none; }
	.rare-arrow.right { transform: translate(calc(-100% - .5rem), -50%); }
	.rare-arrow.left { transform: translate(.5rem, -50%); }
	.rare-arrow.left svg { transform: scaleX(-1); }
	.rare-arrow.down { transform: translate(-50%, calc(-100% - .4rem)); }
	.rare-arrow.down svg { width: 72px; height: 116px; }
	.rare-arrow svg { width: 116px; height: 72px; fill: #e9c95d; stroke: #212121; stroke-width: 3; stroke-linejoin: round; filter: drop-shadow(1px 2px 2px #28304a55); animation: rare-nudge .7s ease-in-out infinite alternate; }
	.rare-arrow.down svg { animation-name: rare-drop; }
	.rare-label, .rare-badge span { color: #212121; font: 700 1.2rem/1.4 'Zen Maru Gothic', sans-serif; white-space: nowrap; }
	.rare-label { padding: .15rem .5rem; border: 2px solid #212121; border-radius: 4px; background: #e9c95d; }
	.rare-badge { position: fixed; bottom: max(1.2rem, env(safe-area-inset-bottom)); left: 50%; z-index: 1000; display: flex; align-items: center; gap: .4rem; padding: .35rem .8rem .35rem .5rem; border: 2px solid #212121; border-radius: 999px; background: #fffdf6; box-shadow: 2px 4px 0 #212121; cursor: pointer; transform: translateX(-50%); animation: rare-bob .7s ease-in-out infinite alternate; }
	.rare-badge.above { top: max(1.2rem, env(safe-area-inset-top)); bottom: auto; }
	.rare-badge.above svg { transform: rotate(180deg); }
	.rare-badge svg { width: 30px; height: 36px; fill: #e9c95d; stroke: #212121; stroke-width: 3; stroke-linejoin: round; }
	@keyframes rare-nudge { from { translate: -4px 0; } to { translate: 4px 0; } }
	@keyframes rare-drop { from { translate: 0 -4px; } to { translate: 0 4px; } }
	@keyframes rare-bob { from { translate: 0 0; } to { translate: 0 6px; } }
	@media (prefers-reduced-motion: reduce) { .rare-arrow svg, .rare-badge { animation: none; } }
</style>
