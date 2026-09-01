<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import ContentGrid from '$lib/components/ContentGrid.svelte';
	import type { ContentSummary } from '$lib/types/content';

	let { data }: { data: { works: ContentSummary[] } } = $props();
	const query = $derived(browser ? (page.url.searchParams.get('q')?.trim() ?? '') : '');
</script>

<svelte:head>
	<title>作品 | かざぐるま</title>
	<meta name="description" content="かざぐるまの作品一覧です。" />
</svelte:head>

<h1>作品</h1>
<ContentGrid items={data.works} {query} />

<style>h1 { margin: 0 0 1.5rem; font-size: clamp(2rem, 6vw, 3.4rem); }</style>
