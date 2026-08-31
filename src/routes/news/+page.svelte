<script lang="ts">
	import ContentGrid from '$lib/components/ContentGrid.svelte';
	import type { ContentSummary } from '$lib/types/content';
	let { data }: { data: { news: ContentSummary[] } } = $props();
</script>

<svelte:head><title>お知らせ | かざぐるま</title><meta name="description" content="かざぐるまからのお知らせです。" /></svelte:head>
<h1>お知らせ</h1>
<ContentGrid items={data.news} />

<style>h1 { margin: 0 0 1.5rem; font-size: clamp(2rem, 6vw, 3.4rem); }</style>
