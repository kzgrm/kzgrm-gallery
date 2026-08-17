<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import ActivityFilter from '$lib/components/ActivityFilter.svelte';
	import type { ActivitySummary } from '$lib/types/activity';

	let { data }: { data: { activities: ActivitySummary[] } } = $props();
	const query = $derived(browser ? (page.url.searchParams.get('q')?.trim() ?? '') : '');
</script>

<svelte:head>
	<title>活動 | かざぐるま</title>
	<meta name="description" content="かざぐるまの活動一覧です。" />
</svelte:head>

<ActivityFilter activities={data.activities} {query} />
