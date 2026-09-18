<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { t } from '$lib/i18n';
	import NoteCard from '$lib/components/NoteCard.svelte';
	import type { ContentSummary } from '$lib/types/content';

	let { items = [], query = '' }: { items?: ContentSummary[]; query?: string } = $props();
	const strings = $derived(t(page.data.lang ?? 'ja'));
	const normalizedQuery = $derived(query.toLocaleLowerCase('ja-JP'));
	const filtered = $derived(
		items.filter((item) => {
			const searchable = `${item.title} ${item.tags.join(' ')} ${item.caption ?? ''} ${item.date}`.toLocaleLowerCase('ja-JP');
			return !normalizedQuery || searchable.includes(normalizedQuery);
		})
	);
</script>

<p class="result-count" aria-live="polite">{strings.resultCount(filtered.length)}</p>
<ul class="cards">
	{#each filtered as item, index (item.slug)}
		<li in:fly={{ y: 10, duration: 180 }} out:fly={{ y: -10, duration: 150 }} animate:flip={{ duration: 240 }}>
			<NoteCard {item} {index} />
		</li>
	{/each}
</ul>

<style>
	.result-count { margin: 0 0 1rem; color: var(--faint); font-size: .78rem; }
	.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin: 0; padding: 0; list-style: none; }
	.cards li { min-width: 0; }
	@media (max-width: 860px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 560px) { .cards { grid-template-columns: 1fr; } }
</style>
