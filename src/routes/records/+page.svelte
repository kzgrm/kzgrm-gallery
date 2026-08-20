<script lang="ts">
	import RecordCard from '$lib/components/RecordCard.svelte';
	import type { ContentSummary } from '$lib/types/content';
	let { data }: { data: { records: ContentSummary[] } } = $props();
</script>

<svelte:head><title>記録 | かざぐるま</title><meta name="description" content="かざぐるまの制作・開発・出演の記録です。" /></svelte:head>
<h1>記録</h1>
<div class="record-list">{#each data.records as record}<RecordCard {record} />{/each}</div>

<style>
	h1 { margin: 0 0 1.5rem; font-size: clamp(2rem, 6vw, 3.4rem); }
	.record-list { display: grid; gap: 1rem; }
</style>
