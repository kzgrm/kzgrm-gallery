<script lang="ts">
	import { base } from '$app/paths';
	import RecordCard from '$lib/components/RecordCard.svelte';
	import type { ContentSummary } from '$lib/types/content';
	import portrait from '../assets/images/about/kzsm.jpg?url';

	let { data }: { data: { latestRecords: ContentSummary[] } } = $props();
	const path = (value: string) => `${base}${value}`;
</script>

<svelte:head>
	<title>かざぐるま</title>
	<meta name="description" content="KZGRM・かざぐるまの公式サイトです。" />
	<meta property="og:title" content="かざぐるま" />
	<meta property="og:description" content="KZGRM・かざぐるまの公式サイトです。" />
</svelte:head>

<section class="hero" aria-label="KZGRM">
	<img class="portrait" src={portrait} alt="風下" />
	<div class="shade"></div>
	<img class="hero-logo" src={path('/header.webp')} alt="かざぐるま" />
</section>

{#if data.latestRecords.length}
	<section class="latest" aria-labelledby="latest-heading">
		<div class="section-heading">
			<h2 id="latest-heading">最新の記録</h2>
			<a href={path('/records/')}>すべて見る →</a>
		</div>
		<div class="record-list">{#each data.latestRecords as record}<RecordCard {record} />{/each}</div>
	</section>
{/if}

<style>
	.hero { position: relative; aspect-ratio: 16 / 8.5; min-height: 340px; overflow: hidden; border-radius: var(--radius-lg); background: #ece2bf; isolation: isolate; }
	.portrait { width: 100%; height: 100%; object-fit: cover; object-position: center; }
	.shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,248,224,.82) 0%, rgba(255,248,224,.34) 38%, transparent 67%); }
	.hero-logo { position: absolute; top: 50%; left: clamp(1.25rem, 6vw, 4.5rem); width: min(36%, 330px); height: auto; transform: translateY(-50%); filter: drop-shadow(0 2px 8px rgba(255,255,255,.45)); }
	.latest { padding-top: clamp(2rem, 5vw, 4rem); }
	.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; }
	.section-heading h2 { margin: 0; font-size: clamp(1.5rem, 4vw, 2.2rem); }
	.section-heading a { color: var(--accent-strong); font-size: .85rem; }
	.record-list { display: grid; gap: 1rem; }
	@media (max-width: 620px) {
		.hero { aspect-ratio: 4 / 5; min-height: 0; }
		.portrait { object-position: 58% center; }
		.shade { background: linear-gradient(180deg, rgba(255,248,224,.7) 0%, transparent 38%); }
		.hero-logo { top: 1.5rem; left: 50%; width: min(68%, 270px); transform: translateX(-50%); }
	}
</style>
