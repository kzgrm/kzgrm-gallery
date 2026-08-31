<script lang="ts">
	import type { ContentSummary } from '$lib/types/content';

	let { item, index = 0 }: { item: ContentSummary; index?: number } = $props();

	// Same 4-color palette used elsewhere in the kzgrm apps -- a brand-new
	// tag gets a stable color with no code change needed here.
	const categoryPalette = ['#a66fe4', '#5a65b1', '#ffda52', '#d2d1d6'];
	function hash(text: string): number {
		let value = 0;
		for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
		return value;
	}
	function categoryColor(category: string): string {
		return categoryPalette[hash(category) % categoryPalette.length];
	}
	// Deterministic per-item tilt (stable across reloads, no two neighbors
	// dead-even) instead of a pin holding the photo down.
	const tiltDeg = $derived(((hash(item.slug) % 130) - 65) / 10); // -6.5..6.5deg
	const delay = $derived(`${Math.min(index * 60, 480)}ms`);
</script>

{#snippet body()}
	{#if item.thumbnail}
		<span class="photo" style={`--tilt:${tiltDeg}deg; --delay:${delay}`}>
			<img src={item.thumbnail} alt="" loading={index < 3 ? 'eager' : 'lazy'} />
		</span>
	{/if}
	<span class="copy">
		{#if item.tags[0]}<span class="tag" style={`background:${categoryColor(item.tags[0])}`}>{item.tags[0]}</span>{/if}
		<strong>{item.title}</strong>
		<time datetime={item.date}>{item.dateLabel}</time>
		{#if item.summary ?? item.caption}<span class="summary">{item.summary ?? item.caption}</span>{/if}
	</span>
{/snippet}

{#if item.externalUrl}
	<a class="note-row" class:without-photo={!item.thumbnail} href={item.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`${item.title}を見る`}>{@render body()}</a>
{:else}
	<a class="note-row" class:without-photo={!item.thumbnail} href={item.url}>{@render body()}</a>
{/if}

<style>
	.note-row { display: grid; grid-template-columns: 5.5rem minmax(0, 1fr); gap: 1.1rem; align-items: center; min-width: 0; padding: 1rem 0; border-bottom: 1px dashed var(--border-strong); color: var(--text); text-decoration: none; }
	.note-row.without-photo { grid-template-columns: minmax(0, 1fr); }
	.note-row:hover strong { color: var(--accent-strong); }
	.photo { display: block; overflow: hidden; width: 100%; padding: .25rem .25rem .45rem; background: #fffdf6; box-shadow: 2px 5px 9px #28304a3d; transform: rotate(var(--tilt)); animation: place-photo .5s var(--delay) both cubic-bezier(.2, .9, .3, 1.2); }
	.photo img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #d8d8d8; }
	.copy { display: flex; min-width: 0; flex-direction: column; }
	.tag { align-self: flex-start; margin-bottom: .4rem; padding: .18rem .55rem; border-radius: 999px; color: #1a1a1a; font-size: .62rem; font-weight: 700; line-height: 1.4; white-space: nowrap; }
	strong { overflow: hidden; font-family: var(--font-display); font-size: 1rem; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
	time { margin-top: .2rem; color: var(--faint); font-size: .7rem; }
	.summary { display: -webkit-box; overflow: hidden; margin-top: .5rem; color: var(--muted); font-size: .82rem; line-height: 1.6; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }

	@keyframes place-photo {
		from { transform: rotate(0deg) scale(.92) translateY(10px); opacity: 0; }
		to { transform: rotate(var(--tilt)) scale(1) translateY(0); opacity: 1; }
	}
	@media (max-width: 560px) { .note-row { grid-template-columns: 4.2rem minmax(0, 1fr); gap: .8rem; } }
	@media (prefers-reduced-motion: reduce) {
		.photo { animation: none; transform: rotate(var(--tilt)); }
	}
</style>
