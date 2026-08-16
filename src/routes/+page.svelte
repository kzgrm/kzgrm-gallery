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
		<h1>つくって、踊って、<br />一緒に回っていく。</h1>
		<p>かざぐるまの作品と活動をまとめる場所です。</p>
		<div class="hero-actions">
			<a class="primary" href={path('/activities/')}>活動を見る</a>
			<a href={path('/about/')}>私たちについて</a>
		</div>
	</div>
	<div class="pinwheel" aria-hidden="true">
		<span></span><span></span><span></span><span></span>
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
	.hero { position: relative; display: grid; min-height: min(610px, 72vh); grid-template-columns: minmax(0, 1.2fr) minmax(260px, .8fr); align-items: center; gap: 3rem; overflow: hidden; }
	.hero-copy { position: relative; z-index: 1; }
	.hero h1 { max-width: 780px; margin: 0; font-size: clamp(2.6rem, 7vw, 5.8rem); line-height: 1.12; letter-spacing: -.045em; }
	.hero-copy > p:not(.eyebrow) { margin: 1.25rem 0 0; color: var(--muted); font-size: clamp(1rem, 2vw, 1.2rem); }
	.hero-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 2rem; }
	.hero-actions a { display: inline-flex; min-height: 2.8rem; align-items: center; padding: .55rem 1rem; border: 1px solid var(--border); border-radius: 999px; color: var(--text); background: var(--card); text-decoration: none; }
	.hero-actions a:hover { border-color: var(--accent); }
	.hero-actions .primary { border-color: var(--accent); color: #fff; background: var(--accent); font-weight: 700; }
	.pinwheel { position: relative; width: min(32vw, 360px); aspect-ratio: 1; justify-self: center; animation: breathe 7s ease-in-out infinite; }
	.pinwheel span { position: absolute; width: 48%; height: 48%; border-radius: 70% 8% 70% 40%; transform-origin: 104% 104%; }
	.pinwheel span:nth-child(1) { background: var(--blade-1); transform: rotate(0deg); }
	.pinwheel span:nth-child(2) { background: #5a65b1; transform: rotate(90deg); }
	.pinwheel span:nth-child(3) { background: #ffda52; transform: rotate(180deg); }
	.pinwheel span:nth-child(4) { background: #d2d1d6; transform: rotate(270deg); }
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
	@keyframes breathe { 0%, 100% { transform: rotate(-4deg) scale(.97); } 50% { transform: rotate(5deg) scale(1.03); } }
	@media (max-width: 760px) {
		.hero { min-height: auto; grid-template-columns: 1fr; gap: 1rem; padding: 2rem 0 4rem; }
		.pinwheel { position: absolute; right: -3.5rem; bottom: 0; width: 190px; opacity: .2; }
		.latest-grid { grid-template-columns: 1fr; }
		.activity-card { display: grid; grid-template-columns: 120px 1fr; }
		.activity-card img { height: 100%; aspect-ratio: auto; }
		.activity-card > span { min-height: 8rem; }
	}
	@media (prefers-reduced-motion: reduce) { .pinwheel { animation: none; } .activity-card { transition: none; } }
</style>
