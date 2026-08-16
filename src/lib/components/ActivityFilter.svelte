<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import type { ActivitySummary } from '$lib/types/activity';

	let { activities = [] }: { activities?: ActivitySummary[] } = $props();
	let selectedTags = $state<string[]>([]);

	const tags = $derived([...new Set(activities.flatMap((item) => item.tags))]);
	const filteredActivities = $derived(
		selectedTags.length === 0
			? activities
			: activities.filter((item) => selectedTags.every((tag) => item.tags.includes(tag)))
	);

	function toggleTag(tag: string) {
		selectedTags = selectedTags.includes(tag)
			? selectedTags.filter((item) => item !== tag)
			: [...selectedTags, tag];
	}
</script>

<div class="filter" aria-label="活動をタグで絞り込む">
	<button class:active={selectedTags.length === 0} onclick={() => (selectedTags = [])} type="button">
		すべて
	</button>
	{#each tags as tag}
		<button
			class:active={selectedTags.includes(tag)}
			aria-pressed={selectedTags.includes(tag)}
			onclick={() => toggleTag(tag)}
			type="button"
		>
			{tag}
		</button>
	{/each}
</div>

<p class="result-count" aria-live="polite">{filteredActivities.length}件の活動</p>
<ul class="cards">
	{#each filteredActivities as activity (activity.slug)}
		<li in:fly={{ y: 10, duration: 180 }} out:fly={{ y: -10, duration: 150 }} animate:flip={{ duration: 240 }}>
			<a href={activity.url}>
				<img src={activity.thumbnail} alt="" loading="lazy" />
				<span class="card-body">
					<time datetime={activity.date}>{activity.dateLabel}</time>
					<strong>{activity.title}</strong>
					<span class="tags">{activity.tags.join(' / ')}</span>
				</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.filter { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.25rem 0 .65rem; }
	button { min-height: 2.35rem; padding: .4rem .8rem; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); background: var(--card); cursor: pointer; }
	button:hover, button:focus-visible { border-color: var(--accent); color: var(--accent); }
	button.active { border-color: var(--accent); color: var(--accent-strong); background: var(--accent-soft); font-weight: 700; }
	.result-count { margin: 0 0 1rem; color: var(--faint); font-size: .78rem; }
	.cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin: 0; padding: 0; list-style: none; }
	.cards li { min-width: 0; }
	.cards a { display: grid; grid-template-columns: minmax(110px, 38%) 1fr; height: 100%; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-lg); color: var(--text); background: var(--card); box-shadow: var(--shadow-sm); text-decoration: none; transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
	.cards a:hover { border-color: var(--border-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
	.cards img { width: 100%; height: 100%; min-height: 150px; object-fit: cover; }
	.card-body { display: flex; min-width: 0; flex-direction: column; padding: 1rem; }
	time { color: var(--faint); font-size: .72rem; }
	strong { margin: .35rem 0 .8rem; font-family: var(--font-display); font-size: 1.05rem; line-height: 1.45; }
	.tags { margin-top: auto; color: var(--accent); font-size: .72rem; }
	@media (max-width: 720px) {
		.cards { grid-template-columns: 1fr; }
		.cards a { grid-template-columns: 120px 1fr; }
		.cards img { min-height: 132px; }
	}
	@media (max-width: 420px) {
		.cards a { grid-template-columns: 1fr; }
		.cards img { aspect-ratio: 16 / 9; min-height: 0; }
	}
	@media (prefers-reduced-motion: reduce) { .cards a { transition: none; } }
</style>
