<script lang="ts">
	import ContentGrid from '$lib/components/ContentGrid.svelte';
	import type { ContentSummary } from '$lib/types/content';
	let { data }: { data: { records: ContentSummary[] } } = $props();
</script>

<svelte:head><title>記録 | かざぐるま</title><meta name="description" content="かざぐるまの制作・開発・出演の記録です。" /></svelte:head>
<h1>記録</h1>
<ContentGrid items={data.records} />

<style>h1 { margin: 0 0 1.5rem; font-size: clamp(2rem, 6vw, 3.4rem); }</style>
