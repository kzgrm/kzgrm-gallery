<script lang="ts">
	import { page } from '$app/state';
	import ContentArticle from '$lib/components/ContentArticle.svelte';
	import { langPath, t } from '$lib/i18n';
	import type { SiteContent } from '$lib/types/content';
	let { data }: { data: { content: SiteContent } } = $props();
	const lang = $derived(page.data.lang ?? 'ja');
	const strings = $derived(t(lang).records);
</script>

<svelte:head><title>{data.content.title} | かざぐるま</title><meta name="description" content={data.content.summary ?? data.content.title} /></svelte:head>
<ContentArticle content={data.content} backUrl={langPath(lang, '/records/')} backLabel={strings.back} eyebrow={strings.eyebrow} showThumbnail />
