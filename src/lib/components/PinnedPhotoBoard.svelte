<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { shuffledHomePins, type HomePinPhoto } from '$lib/home-pins';
	import { addWindImpulse, pendulumIsAtRest, stepPendulum, type PendulumState } from '$lib/photo-motion';

	let { photos }: { photos: HomePinPhoto[] } = $props();
	let board = $state<HTMLElement>();
	let displayed = $state<HomePinPhoto[]>([]);
	type PhotoPendulum = PendulumState & { element: HTMLElement; index: number };
	let pendulums: PhotoPendulum[] = [];
	let frameId = 0;
	let lastTime = 0;
	const initialAngles = [-11, 8, -7, 12, -9, 10, -13, 7, -8, 11];
	function gridPosition(index: number, total: number) {
		const leftCount = Math.ceil(total / 2);
		return index < leftCount ? { column: 1, row: index + 1 } : { column: 3, row: index - leftCount + 1 };
	}

	function animate(time: number) {
		const elapsed = lastTime ? (time - lastTime) / 1000 : 1 / 60;
		lastTime = time;
		let moving = false;
		for (const pendulum of pendulums) {
			const next = stepPendulum(pendulum, elapsed);
			pendulum.angle = next.angle;
			pendulum.velocity = next.velocity;
			if (pendulumIsAtRest(pendulum)) {
				pendulum.angle = 0;
				pendulum.velocity = 0;
			} else {
				moving = true;
			}
			pendulum.element.style.transform = `rotate(${pendulum.angle}deg)`;
		}
		frameId = moving ? requestAnimationFrame(animate) : 0;
	}

	function wakePendulums() {
		if (frameId) return;
		lastTime = 0;
		frameId = requestAnimationFrame(animate);
	}

	function startMotion() {
		if (!board || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		pendulums = Array.from(board.querySelectorAll<HTMLElement>('figure[data-index]'), (element) => {
			const index = Number(element.dataset.index);
			return { element, index, angle: initialAngles[index]!, velocity: 0 };
		});
		wakePendulums();
	}

	function catchHeaderWind(event: Event) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const strength = event instanceof CustomEvent && typeof event.detail?.strength === 'number' ? event.detail.strength : 1;
		for (const pendulum of pendulums) {
			const center = pendulum.element.getBoundingClientRect().left + pendulum.element.offsetWidth / 2;
			const direction: -1 | 1 = center < window.innerWidth / 2 ? -1 : 1;
			const next = addWindImpulse(pendulum, direction, strength);
			pendulum.velocity = next.velocity;
		}
		wakePendulums();
	}

	onMount(() => {
		if (photos.length === 0 || photos.length > 10) return;
		displayed = shuffledHomePins(photos);
		window.addEventListener('kzgrm:header-wind', catchHeaderWind);
		const setupFrame = requestAnimationFrame(startMotion);
		return () => {
			window.removeEventListener('kzgrm:header-wind', catchHeaderWind);
			cancelAnimationFrame(setupFrame);
			if (frameId) cancelAnimationFrame(frameId);
		};
	});
</script>

{#if displayed.length > 0}
	<section class="photo-board" bind:this={board} aria-label="かざぐるまの活動写真">
		{#each displayed as photo, index (photo.id)}
			{@const position = gridPosition(index, displayed.length)}
			<figure style={`--start:${initialAngles[index]}deg;--column:${position.column};--row:${position.row}`} data-index={index}>
				<span class="pin" aria-hidden="true"></span><img src={`${base}${photo.src}`} alt={photo.alt} />
				{#if photo.caption}<figcaption>{photo.caption}</figcaption>{/if}
			</figure>
		{/each}
	</section>
{/if}

<style>
	@media(max-width:620px){.photo-board{order:2}}
	.photo-board{display:contents}.photo-board figure{position:relative;grid-column:var(--column);grid-row:var(--row);width:92%;margin:0 auto;padding:.3rem .3rem .65rem;background:#fffdf6;box-shadow:2px 5px 9px #28304a3d;transform:rotate(var(--start));transform-origin:50% 2px;will-change:transform}.photo-board figure:nth-child(odd){width:98%}.photo-board img{display:block;width:100%;height:clamp(74px,9vw,105px);object-fit:cover;background:#d8d8d8}.photo-board figure:nth-child(3n+2) img{height:clamp(92px,11vw,126px)}.photo-board figcaption{overflow:hidden;margin-top:.25rem;color:#4e453d;font:italic clamp(.45rem,.65vw,.56rem) 'Comic Sans MS',cursive;text-align:center;text-overflow:ellipsis;white-space:nowrap}.pin{position:absolute;z-index:2;top:-5px;left:50%;width:13px;height:13px;border:2px solid #762f39;border-radius:50%;background:#d64d61;box-shadow:0 2px 2px #26191a66,inset -2px -2px #8c2638;transform:translateX(-50%)}
	@media(max-width:620px){.photo-board{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem .8rem;margin-top:1.25rem;padding:.9rem .35rem}.photo-board figure,.photo-board figure:nth-child(n){grid-column:auto;grid-row:auto;width:92%;margin:0}.photo-board figure:nth-child(even){justify-self:end}.photo-board img,.photo-board figure:nth-child(3n+2) img{height:clamp(100px,32vw,150px)}.photo-board figure:nth-child(3n+2) img{height:clamp(125px,39vw,180px)}.photo-board figcaption{font-size:.55rem}}
	@media(prefers-reduced-motion:reduce){.photo-board figure{transform:rotate(0deg);will-change:auto}}
</style>
