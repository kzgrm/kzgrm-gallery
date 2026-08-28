<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import type { ContentSummary } from '$lib/types/content';

	let { works = [], query = '' }: { works?: ContentSummary[]; query?: string } = $props();
	const normalizedQuery = $derived(query.toLocaleLowerCase('ja-JP'));
	const filteredWorks = $derived(
		works.filter((item) => {
			const searchable = `${item.title} ${item.tags.join(' ')} ${item.caption ?? ''} ${item.date}`.toLocaleLowerCase('ja-JP');
			return !normalizedQuery || searchable.includes(normalizedQuery);
		})
	);

	// Same 4 colors used across the kzgrm apps (compass's site-menu icons,
	// this site's own header ring). Hashing the category name into this
	// palette means a brand-new category (本, ゲーム, ...) gets a stable
	// color with no code change needed here.
	const categoryPalette = ['#a66fe4', '#5a65b1', '#ffda52', '#d2d1d6'];
	function categoryColor(category: string): string {
		let hash = 0;
		for (const char of category) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
		return categoryPalette[hash % categoryPalette.length];
	}
</script>

<p class="result-count" aria-live="polite">{filteredWorks.length}件の作品</p>
<ul class="cards">
	{#each filteredWorks as work, index (work.slug)}
		<li in:fly={{ y: 10, duration: 180 }} out:fly={{ y: -10, duration: 150 }} animate:flip={{ duration: 240 }}>
			{#if work.externalUrl}
				<a class="work-card linked" href={work.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`${work.title}を見る`}>
					{#if work.thumbnail}<img src={work.thumbnail} alt="" loading={index < 3 ? 'eager' : 'lazy'} />{/if}
					<span class="overlay"><small>{work.caption ?? ''}</small><strong>{work.title}</strong><time datetime={work.date}>{work.dateLabel}</time></span>
					{#if work.tags[0]}<span class="category" style={`background:${categoryColor(work.tags[0])}`}>{work.tags[0]}</span>{/if}
				</a>
			{:else}
				<article class="work-card">
					{#if work.thumbnail}<img src={work.thumbnail} alt="" loading={index < 3 ? 'eager' : 'lazy'} />{/if}
					<span class="overlay"><small>{work.caption ?? ''}</small><strong>{work.title}</strong><time datetime={work.date}>{work.dateLabel}</time></span>
					{#if work.tags[0]}<span class="category" style={`background:${categoryColor(work.tags[0])}`}>{work.tags[0]}</span>{/if}
				</article>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.result-count { margin: 0 0 1rem; color: var(--faint); font-size: .78rem; }
	.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin: 0; padding: 0; list-style: none; }
	.cards li { min-width: 0; }
	.work-card { position: relative; display: block; aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-lg); color: #fff; background: #202432; box-shadow: var(--shadow-sm); isolation: isolate; }
	.work-card::after { position: absolute; inset: 28% 0 0; z-index: 1; background: linear-gradient(180deg, transparent, rgba(10,12,20,.84)); content: ''; pointer-events: none; }
	.work-card img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .28s ease; }
	.work-card.linked:hover img { transform: scale(1.025); }
	.work-card.linked:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
	.overlay { position: absolute; right: 0; bottom: 0; left: 0; z-index: 2; display: grid; padding: 1rem; text-shadow: 0 1px 3px rgba(0,0,0,.45); }
	.overlay small { min-height: 1em; margin-bottom: .2rem; font-size: .65rem; line-height: 1.2; opacity: .8; }
	.overlay strong { overflow: hidden; font-family: var(--font-display); font-size: .92rem; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
	.overlay time { margin-top: .2rem; font-size: .62rem; opacity: .72; }
	.category { position: absolute; right: .5rem; bottom: .5rem; z-index: 3; padding: .18rem .5rem; border-radius: 999px; color: #1a1a1a; font-size: .62rem; font-weight: 700; line-height: 1.4; white-space: nowrap; }
	@media (max-width: 860px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 560px) { .cards { grid-template-columns: 1fr; } .overlay { padding: .85rem; } }
	@media (prefers-reduced-motion: reduce) { .work-card img { transition: none; } }
</style>
