<script lang="ts">
	import { base } from '$app/paths';
	import type { Activity } from '$lib/types/activity';

	let { data }: { data: { activity: Activity } } = $props();
</script>

<svelte:head>
	<title>{data.activity.title} | かざぐるま</title>
	<meta name="description" content={data.activity.title} />
	<meta property="og:title" content={`${data.activity.title} | かざぐるま`} />
</svelte:head>

<article class="article">
	<a class="back" href={`${base}/activities/`}>← 活動一覧へ</a>
	<header>
		<p class="eyebrow">Activity</p>
		<h1>{data.activity.title}</h1>
		<div class="meta">
			<time datetime={data.activity.date}>{data.activity.dateLabel}</time>
			{#if data.activity.tags.length}<span>{data.activity.tags.join(' / ')}</span>{/if}
		</div>
	</header>
	<div class="prose content">{@html data.activity.html}</div>
</article>

<style>
	.article { max-width: 820px; margin: 0 auto; }
	.back { display: inline-flex; margin-bottom: 2rem; color: var(--accent-strong); font-size: .85rem; }
	header { padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	h1 { margin: 0; font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.25; }
	.meta { display: flex; flex-wrap: wrap; gap: .6rem 1.25rem; margin-top: 1rem; color: var(--faint); font-size: .8rem; }
	.meta span { color: var(--accent); }
	.content { padding-top: 1.5rem; }
</style>
