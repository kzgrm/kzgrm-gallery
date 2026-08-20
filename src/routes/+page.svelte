<script lang="ts">
	import NostalgicHome from '$lib/components/NostalgicHome.svelte';
	import type { ContentSummary } from '$lib/types/content';

	let { data }: { data: { latestRecords: ContentSummary[]; works: ContentSummary[] } } = $props();
</script>

<svelte:head>
	<title>かざぐるま</title>
	<meta name="description" content="KZGRM・かざぐるまの公式サイトです。" />
	<meta property="og:title" content="かざぐるま" />
	<meta property="og:description" content="KZGRM・かざぐるまの公式サイトです。" />
</svelte:head>

<NostalgicHome works={data.works} records={data.latestRecords} />

<style>
	:global(.site-header){border-bottom:3px double #5362a4;background:#fffdf7;backdrop-filter:none}
	:global(.announcement){border-bottom:1px dashed #9ca6bd;background:#fff9d9}
	:global(footer){border-top:3px double #5362a4;background:#fffdf7}
</style>
