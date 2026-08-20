<script lang="ts">
	import type { ContentSummary } from '$lib/types/content';
	let { data }: { data: { news: ContentSummary[] } } = $props();
</script>

<svelte:head><title>お知らせ | かざぐるま</title><meta name="description" content="かざぐるまからのお知らせです。" /></svelte:head>
<h1>お知らせ</h1>
<ul class="news-list">
	{#each data.news as item}
		<li><a href={item.url}><time datetime={item.date}>{item.dateLabel}</time><strong>{item.title}</strong>{#if item.tags[0]}<small>{item.tags[0]}</small>{/if}<span aria-hidden="true">→</span></a></li>
	{/each}
</ul>

<style>
	h1 { margin: 0 0 1.5rem; font-size: clamp(2rem, 6vw, 3.4rem); }
	.news-list { margin: 0; padding: 0; border-top: 1px solid var(--border); list-style: none; }
	.news-list a { display: grid; grid-template-columns: 8rem minmax(0, 1fr) auto auto; gap: 1rem; align-items: center; min-height: 4.4rem; padding: .85rem .2rem; border-bottom: 1px solid var(--border); color: var(--text); text-decoration: none; }
	.news-list a:hover strong { color: var(--accent-strong); }
	time { color: var(--faint); font-size: .72rem; }
	strong { font-family: var(--font-display); }
	small { padding: .2rem .5rem; border-radius: 999px; color: var(--accent-strong); background: var(--accent-soft); font-size: .65rem; }
	.news-list span { color: var(--accent); }
	@media (max-width: 600px) { .news-list a { grid-template-columns: minmax(0, 1fr) auto; gap: .25rem .75rem; } time, small { grid-column: 1; } strong { grid-column: 1; } .news-list span { grid-column: 2; grid-row: 1 / 4; } small { justify-self: start; } }
</style>
