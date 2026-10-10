<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { page } from '$app/state';
	import ContentGrid from '$lib/components/ContentGrid.svelte';
	import { t } from '$lib/i18n';
	import type { ContentSummary } from '$lib/types/content';
	let { data }: { data: { records: ContentSummary[] } } = $props();
	const strings = $derived(t(page.data.lang ?? 'ja').listPages.records);
</script>

<Seo title={strings.title} description={strings.description} />
<h1>{strings.heading}</h1>
<ContentGrid items={data.records} />

<style>h1 { margin: 0 0 1.5rem; font-size: clamp(2rem, 6vw, 3.4rem); }</style>
