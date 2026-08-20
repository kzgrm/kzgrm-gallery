<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import type { ContentSummary } from '$lib/types/content';

	let { works = [], query = '' }: { works?: ContentSummary[]; query?: string } = $props();
	let selectedTags = $state<string[]>([]);
	const tags = $derived([...new Set(works.flatMap((item) => item.tags))]);
	const normalizedQuery = $derived(query.toLocaleLowerCase('ja-JP'));
	const filteredWorks = $derived(
		works.filter((item) => {
			const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => item.tags.includes(tag));
			const searchable = `${item.title} ${item.tags.join(' ')} ${item.caption ?? ''} ${item.date}`.toLocaleLowerCase('ja-JP');
			return matchesTags && (!normalizedQuery || searchable.includes(normalizedQuery));
		})
	);

	function toggleTag(tag: string) {
		selectedTags = selectedTags.includes(tag)
			? selectedTags.filter((item) => item !== tag)
			: [...selectedTags, tag];
	}
</script>

<div class="filter" aria-label="作品をタグで絞り込む">
	<button class:active={selectedTags.length === 0} onclick={() => (selectedTags = [])} type="button">すべて</button>
	{#each tags as tag}
		<button class:active={selectedTags.includes(tag)} aria-pressed={selectedTags.includes(tag)} onclick={() => toggleTag(tag)} type="button">{tag}</button>
	{/each}
</div>

<p class="result-count" aria-live="polite">{filteredWorks.length}件の作品</p>
<ul class="cards">
	{#each filteredWorks as work, index (work.slug)}
		<li in:fly={{ y: 10, duration: 180 }} out:fly={{ y: -10, duration: 150 }} animate:flip={{ duration: 240 }}>
			{#if work.externalUrl}
				<a class="work-card linked" href={work.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`${work.title}を見る`}>
					{#if work.thumbnail}<img src={work.thumbnail} alt="" loading={index < 3 ? 'eager' : 'lazy'} />{/if}
					<span class="overlay"><small>{work.caption ?? ''}</small><strong>{work.title}</strong><time datetime={work.date}>{work.dateLabel}</time></span>
				</a>
			{:else}
				<article class="work-card">
					{#if work.thumbnail}<img src={work.thumbnail} alt="" loading={index < 3 ? 'eager' : 'lazy'} />{/if}
					<span class="overlay"><small>{work.caption ?? ''}</small><strong>{work.title}</strong><time datetime={work.date}>{work.dateLabel}</time></span>
				</article>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.filter { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.25rem 0 .65rem; }
	button { min-height: 2.35rem; padding: .4rem .8rem; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); background: var(--card); cursor: pointer; }
	button:hover, button:focus-visible { border-color: var(--accent); color: var(--accent); }
	button.active { border-color: var(--accent); color: var(--accent-strong); background: var(--accent-soft); font-weight: 700; }
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
	@media (max-width: 860px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 560px) { .cards { grid-template-columns: 1fr; } .overlay { padding: .85rem; } }
	@media (prefers-reduced-motion: reduce) { .work-card img { transition: none; } }
</style>
