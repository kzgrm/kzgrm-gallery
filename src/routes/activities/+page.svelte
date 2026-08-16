<script lang="ts">
	import ActivityFilter from '$lib/components/ActivityFilter.svelte';
	import type { ActivitySummary } from '$lib/types/activity';

	let { data }: { data: { activities: ActivitySummary[] } } = $props();
</script>

<svelte:head>
	<title>活動 | かざぐるま</title>
	<meta name="description" content="かざぐるまの活動一覧です。" />
</svelte:head>

<header class="page-heading">
	<p class="eyebrow">Activities</p>
	<h1>活動</h1>
	<!-- TODO: 公開前にKZGRMメンバーで紹介文を決める -->
	<p>活動紹介文（仮）</p>
</header>

<ActivityFilter activities={data.activities} />
