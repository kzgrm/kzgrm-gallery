<script lang="ts">
	import type { ContentSummary } from '$lib/types/content';
	let { record }: { record: ContentSummary } = $props();
</script>

<a class:without-image={!record.thumbnail} class="record-card" href={record.url}>
	{#if record.thumbnail}<img src={record.thumbnail} alt="" loading="lazy" />{/if}
	<span class="record-copy">
		<time datetime={record.date}>{record.dateLabel}</time>
		<strong>{record.title}</strong>
		{#if record.summary}<span>{record.summary}</span>{/if}
	</span>
</a>

<style>
	.record-card { display: grid; grid-template-columns: minmax(150px, 30%) 1fr; min-height: 150px; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-lg); color: var(--text); background: var(--card); box-shadow: var(--shadow-sm); text-decoration: none; transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
	.record-card.without-image { grid-template-columns: 1fr; }
	.record-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
	img { width: 100%; height: 100%; object-fit: cover; }
	.record-copy { display: flex; min-width: 0; flex-direction: column; justify-content: center; padding: 1.15rem; }
	time { color: var(--faint); font-size: .7rem; }
	strong { margin-top: .35rem; font-family: var(--font-display); font-size: 1.05rem; line-height: 1.4; }
	.record-copy > span { display: -webkit-box; overflow: hidden; margin-top: .65rem; color: var(--muted); font-size: .82rem; line-height: 1.6; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
	@media (max-width: 560px) { .record-card { grid-template-columns: 1fr; } img { aspect-ratio: 16 / 9; } }
	@media (prefers-reduced-motion: reduce) { .record-card { transition: none; } }
</style>
