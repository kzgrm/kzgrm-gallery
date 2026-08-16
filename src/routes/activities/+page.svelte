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
	<p>これまでにつくったもの、踊ったもの、出会った場所。</p>
</header>

<ActivityFilter activities={data.activities} />
