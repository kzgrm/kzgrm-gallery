<script lang="ts">
	import { base } from '$app/paths';
	import type { ActivitySummary } from '$lib/types/activity';

	let { data }: { data: { latest: ActivitySummary[] } } = $props();
	const path = (value: string) => `${base}${value}`;
</script>

<svelte:head>
	<title>かざぐるま</title>
	<meta name="description" content="かざぐるまの作品と活動をまとめた公式サイトです。" />
	<meta property="og:title" content="かざぐるま" />
	<meta property="og:description" content="かざぐるまの作品と活動をまとめた公式サイトです。" />
</svelte:head>

<section class="hero">
	<div class="hero-copy">
		<p class="eyebrow">KAZAGURUMA / KZGRM</p>
		<p>かざぐるまの作品と活動をまとめる場所です。</p>
		<div class="hero-actions">
			<a class="primary" href={path('/activities/')}>活動を見る</a>
			<a href={path('/about/')}>私たちについて</a>
		</div>
	</div>
</section>

<section class="latest" aria-labelledby="latest-heading">
	<div class="section-heading">
		<div>
			<p class="eyebrow">Latest activities</p>
			<h2 id="latest-heading">最近の活動</h2>
		</div>
		<a href={path('/activities/')}>すべて見る →</a>
	</div>
	<div class="latest-grid">
		{#each data.latest as activity}
			<a class="activity-card" href={activity.url}>
				<img src={activity.thumbnail} alt="" loading="lazy" />
				<span>
					<time datetime={activity.date}>{activity.dateLabel}</time>
					<strong>{activity.title}</strong>
					<small>{activity.tags.join(' / ')}</small>
				</span>
			</a>
		{/each}
	</div>
</section>

<style>
	.hero { position: relative; display: grid; padding: clamp(2rem, 6vw, 4rem) 0; gap: 3rem; overflow: hidden; }
	.hero-copy { position: relative; z-index: 1; }
	.hero-copy > p:not(.eyebrow) { margin: 1.25rem 0 0; color: var(--muted); font-size: clamp(1rem, 2vw, 1.2rem); }
	.hero-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 2rem; }
	.hero-actions a { display: inline-flex; min-height: 2.8rem; align-items: center; padding: .55rem 1rem; border: 1px solid var(--border); border-radius: 999px; color: var(--text); background: var(--card); text-decoration: none; }
	.hero-actions a:hover { border-color: var(--accent); }
	.hero-actions .primary { border-color: var(--accent); color: #fff; background: var(--accent); font-weight: 700; }
	.latest { padding-top: clamp(2rem, 5vw, 4rem); border-top: 1px solid var(--border); }
	.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.4rem; }
	.section-heading h2 { margin: 0; font-size: clamp(1.6rem, 4vw, 2.4rem); }
	.section-heading > a { color: var(--accent-strong); font-size: .9rem; }
	.latest-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
	.activity-card { overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-lg); color: var(--text); background: var(--card); box-shadow: var(--shadow-sm); text-decoration: none; transition: transform .15s ease, box-shadow .15s ease; }
	.activity-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
	.activity-card img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }
	.activity-card > span { display: flex; min-height: 9rem; flex-direction: column; padding: 1rem; }
	.activity-card time, .activity-card small { color: var(--faint); font-size: .72rem; }
	.activity-card strong { margin: .35rem 0 .8rem; font-family: var(--font-display); line-height: 1.45; }
	.activity-card small { margin-top: auto; color: var(--accent); }
	@media (max-width: 760px) {
		.hero { gap: 1rem; padding: 2rem 0 4rem; }
		.latest-grid { grid-template-columns: 1fr; }
		.activity-card { display: grid; grid-template-columns: 120px 1fr; }
		.activity-card img { height: 100%; aspect-ratio: auto; }
		.activity-card > span { min-height: 8rem; }
	}
	@media (prefers-reduced-motion: reduce) { .activity-card { transition: none; } }
</style>
