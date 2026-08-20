<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import NostalgicEdition from '$lib/components/editions/NostalgicEdition.svelte';
	import ZineEdition from '$lib/components/editions/ZineEdition.svelte';
	import DesktopEdition from '$lib/components/editions/DesktopEdition.svelte';
	import BroadcastEdition from '$lib/components/editions/BroadcastEdition.svelte';
	import MangaEdition from '$lib/components/editions/MangaEdition.svelte';
	import SiteEditionSwitcher from '$lib/components/SiteEditionSwitcher.svelte';
	import { isSiteEdition, siteEditions, type SiteEditionId } from '$lib/types/site-edition';
	import type { ContentSummary } from '$lib/types/content';

	let { data }: { data: { latestRecords: ContentSummary[]; works: ContentSummary[]; initialEdition: SiteEditionId } } = $props();
	function initialWorks() { return data.works.slice(0, 6); }
	function initialEdition() { return data.initialEdition; }
	let active = $state<SiteEditionId>(initialEdition());
	let randomWorks = $state<ContentSummary[]>(initialWorks());

	function shuffledWorks() { return [...data.works].sort(() => Math.random() - .5).slice(0, 6); }
	function setDocumentEdition(edition: SiteEditionId) { active = edition; document.documentElement.dataset.siteEdition = edition; }
	function setUrlEdition(edition: SiteEditionId) { const url = new URL(window.location.href); url.searchParams.set('edition', edition); replaceState(url, {}); }
	function selectEdition(edition: SiteEditionId) { setDocumentEdition(edition); localStorage.setItem('kzgrm-edition-choice', edition); sessionStorage.setItem('kzgrm-edition-session', edition); setUrlEdition(edition); }
	function randomEdition() {
		localStorage.removeItem('kzgrm-edition-choice');
		const candidates = siteEditions.filter((edition) => edition.id !== active);
		const edition = candidates[Math.floor(Math.random() * candidates.length)]?.id ?? 'nostalgic';
		setDocumentEdition(edition); sessionStorage.setItem('kzgrm-edition-session', edition); setUrlEdition(edition); randomWorks = shuffledWorks();
	}

	onMount(() => {
		const query = new URL(window.location.href).searchParams.get('edition');
		const stored = localStorage.getItem('kzgrm-edition-choice');
		const session = sessionStorage.getItem('kzgrm-edition-session');
		const edition = isSiteEdition(query) ? query : isSiteEdition(stored) ? stored : isSiteEdition(session) ? session : siteEditions[Math.floor(Math.random() * siteEditions.length)].id;
		setDocumentEdition(edition); sessionStorage.setItem('kzgrm-edition-session', edition); randomWorks = shuffledWorks();
	});
</script>

<svelte:head><title>かざぐるま</title><meta name="description" content="KZGRM・かざぐるまの公式サイトです。" /></svelte:head>

{#if active === 'nostalgic'}
	<NostalgicEdition works={randomWorks.slice(0, 4)} records={data.latestRecords} onShuffle={() => randomWorks = shuffledWorks()} />
{:else if active === 'zine'}
	<ZineEdition works={randomWorks} records={data.latestRecords} />
{:else if active === 'desktop'}
	<DesktopEdition works={randomWorks} records={data.latestRecords} />
{:else if active === 'broadcast'}
	<BroadcastEdition works={randomWorks} records={data.latestRecords} />
{:else}
	<MangaEdition works={randomWorks} records={data.latestRecords} />
{/if}

<SiteEditionSwitcher {active} onSelect={selectEdition} onRandom={randomEdition} />

<style>
	:global(html[data-site-edition='nostalgic'] body){background-color:#fbfaf4;background-image:linear-gradient(#dfe5ec 1px,transparent 1px),linear-gradient(90deg,#dfe5ec 1px,transparent 1px);background-size:22px 22px}
	:global(html[data-site-edition='nostalgic'] .site-header){border-bottom:3px double #5362a4;background:#fffdf7;backdrop-filter:none}
	:global(html[data-site-edition='nostalgic'] .announcement){border-bottom:1px dashed #9ca6bd;background:#fff9d9}
	:global(html[data-site-edition='nostalgic'] body>div>main){width:min(100% - 1.25rem,1120px);padding-top:.5rem}
	:global(html[data-site-edition='nostalgic'] footer){border-top:3px double #5362a4;background:#fffdf7}
	:global(html[data-site-edition='zine'] body){background:#c9c0aa}
	:global(html[data-site-edition='zine'] .site-header){border-bottom:6px solid #171717;background:#efe5c9;backdrop-filter:none}
	:global(html[data-site-edition='zine'] .announcement){color:#fff;background:#283260}
	:global(html[data-site-edition='zine'] body>div>main){width:min(100% - 1rem,1120px);padding:1rem 0 2rem}
	:global(html[data-site-edition='desktop'] body){background:#278d89}
	:global(html[data-site-edition='desktop'] .site-header){border-bottom:3px outset #eee;background:#c0c0c0;backdrop-filter:none}
	:global(html[data-site-edition='desktop'] .announcement){border-bottom:2px outset #fff;background:#c0c0c0}
	:global(html[data-site-edition='desktop'] body>div>main){width:min(100% - 1rem,1120px);padding:1rem 0}
	:global(html[data-site-edition='broadcast'] body){color:#fff;background:#111}
	:global(html[data-site-edition='broadcast'] .site-header){border-bottom:5px solid #f1d233;background:#111;backdrop-filter:none}
	:global(html[data-site-edition='broadcast'] .announcement){color:#111;background:#f1d233}
	:global(html[data-site-edition='broadcast'] body>div>main){width:min(100% - 1rem,1120px);padding:1rem 0}
	:global(html[data-site-edition='manga'] body){color:#000;background:#eee}
	:global(html[data-site-edition='manga'] .site-header){border-bottom:5px solid #000;background:#fff;backdrop-filter:none}
	:global(html[data-site-edition='manga'] .announcement){border-bottom:3px solid #000;background:#fff}
	:global(html[data-site-edition='manga'] body>div>main){width:min(100% - 1rem,1040px);padding:1rem 0}
	@media(max-width:620px){:global(html[data-site-edition] body>div>main){width:100%;padding-top:.5rem}}
</style>
