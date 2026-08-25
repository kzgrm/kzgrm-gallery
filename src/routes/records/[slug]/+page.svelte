<script lang="ts">
	import { base } from '$app/paths';
	import ContentArticle from '$lib/components/ContentArticle.svelte';
	import type { SiteContent } from '$lib/types/content';
	let { data }: { data: { content: SiteContent } } = $props();
</script>

<svelte:head><title>{data.content.title} | かざぐるま</title><meta name="description" content={data.content.summary ?? data.content.title} /></svelte:head>
<ContentArticle content={data.content} backUrl={`${base}/records/`} backLabel="記録一覧へ" eyebrow="Record" showThumbnail />
