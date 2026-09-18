<script lang="ts">
	import { page } from '$app/state';
	import NostalgicHome from '$lib/components/NostalgicHome.svelte';
	import { t } from '$lib/i18n';
	import type { HomePinPhoto } from '$lib/home-pins';
	import type { ContentSummary } from '$lib/types/content';

	let { data }: { data: { latestRecords: ContentSummary[]; works: ContentSummary[]; homePins: HomePinPhoto[] } } = $props();
	const strings = $derived(t(page.data.lang ?? 'ja').home_meta);
</script>

<svelte:head>
	<title>{strings.title}</title>
	<meta name="description" content={strings.description} />
	<meta property="og:title" content={strings.title} />
	<meta property="og:description" content={strings.description} />
</svelte:head>

<NostalgicHome works={data.works} records={data.latestRecords} photos={data.homePins} />

<style>
	:global(.site-header){border-bottom:3px double #5362a4;background:#fffdf7;backdrop-filter:none}
	:global(.announcement){border-bottom:1px dashed #9ca6bd;background:#fff9d9}
	:global(footer){border-top:3px double #5362a4;background:#fffdf7}
</style>
