<script lang="ts">
	import { page } from '$app/state';
	import ContentGrid from '$lib/components/ContentGrid.svelte';
	import { t } from '$lib/i18n';
	import type { ContentSummary } from '$lib/types/content';
	let { data }: { data: { news: ContentSummary[] } } = $props();
	const strings = $derived(t(page.data.lang ?? 'ja').listPages.news);
</script>

<svelte:head><title>{strings.title}</title><meta name="description" content={strings.description} /></svelte:head>
<h1>{strings.heading}</h1>
<ContentGrid items={data.news} />

<style>h1 { margin: 0 0 1.5rem; font-size: clamp(2rem, 6vw, 3.4rem); }</style>
