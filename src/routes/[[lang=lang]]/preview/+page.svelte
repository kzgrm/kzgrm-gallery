<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	// The preview renders the site's own pages, not a likeness of them: what Compass shows before
	// publishing is then exactly what the page will look like.
	import WorksPage from '../works/+page.svelte';
	import RecordsPage from '../records/+page.svelte';
	import NewsPage from '../news/+page.svelte';
	import RecordPage from '../records/[slug]/+page.svelte';
	import NewsArticlePage from '../news/[slug]/+page.svelte';
	import { decodePreviewMessage, previewMessageType, validPreviewToken } from '$lib/preview-contract.js';
	import { renderPreviewMarkdown } from '$lib/preview-markdown';
	import { homepagePreviewState } from '$lib/preview-state.svelte';
	import type { ContentKind, ContentSummary, SiteContent } from '$lib/types/content';

	type PreviewContent = {
		slug: string; title: string; date: string; kind: ContentKind; tags: string[]; summary: string; caption: string;
		author: string; externalUrl: string; rail: boolean; body: string; thumbnailUrl: string; assetBaseUrl: string;
	};
	let { data }: { data: { works: ContentSummary[]; records: ContentSummary[]; news: ContentSummary[] } } = $props();
	let content = $state<SiteContent | null>(null);
	let invalidToken = $state(false);
	// Works have no page of their own: a work only ever appears as a card in the works list.
	// Records and news have both, so the preview can show either.
	const hasOwnPage = (kind: ContentKind) => kind !== 'work';
	let view = $state<'page' | 'list'>('page');
	const shown = $derived(content && hasOwnPage(content.kind) ? view : 'list');
	const collections: Record<ContentKind, 'works' | 'records' | 'news'> = { work: 'works', record: 'records', news: 'news' };
	/** The list as it will be once this item is published: it replaces its saved version, in date order. */
	function listWith(items: ContentSummary[], item: SiteContent): ContentSummary[] {
		const { html: _html, ...summary } = item;
		return [...items.filter((other) => other.slug !== item.slug), summary].sort((a, b) => b.date.localeCompare(a.date));
	}
	// Links inside the preview: the item's own card opens its page here (it is not published, so
	// its address does not exist yet), "back" returns to the list, and other pages of the site
	// are not followed, since leaving this page would drop the unsaved content.
	function followLink(event: MouseEvent) {
		const anchor = (event.target as Element | null)?.closest?.('a');
		if (!anchor || !content) return;
		const target = new URL(anchor.href, location.href);
		if (target.origin !== location.origin) return;
		event.preventDefault();
		if (!hasOwnPage(content.kind)) return;
		if (target.pathname === new URL(content.url, location.href).pathname) view = 'page';
		else if (target.pathname.replace(/\/$/, '').endsWith(`/${collections[content.kind]}`)) view = 'list';
	}
	const dateLabel = (date: string) => date.split('-').map(Number).join('/');
	function siteContent(value: PreviewContent): SiteContent {
		return {
			slug: value.slug, title: value.title, date: value.date, dateLabel: dateLabel(value.date), kind: value.kind, tags: value.tags,
			thumbnail: value.thumbnailUrl || undefined, summary: value.summary || undefined, caption: value.caption || undefined,
			author: value.author || undefined, externalUrl: value.externalUrl || undefined, rail: value.rail, listed: true,
			publicationState: 'draft', url: hasOwnPage(value.kind) ? `${base}/${collections[value.kind]}/${value.slug}/` : `${base}/preview/`, html: renderPreviewMarkdown(value.body, value.assetBaseUrl)
		};
	}

	onMount(() => {
		const token = new URLSearchParams(location.hash.slice(1)).get('token') ?? '';
		if (!validPreviewToken(token)) { invalidToken = true; return; }
		const receive = (event: MessageEvent) => {
			if (event.source !== window.parent) return;
			const decoded = decodePreviewMessage(event.data, token) as PreviewContent | null;
			if (!decoded) return;
			content = siteContent(decoded);
			homepagePreviewState.railItem = content;
		};
		window.addEventListener('message', receive);
		window.parent.postMessage({ type: `${previewMessageType}:ready`, token }, '*');
		return () => { window.removeEventListener('message', receive); homepagePreviewState.railItem = null; };
	});
</script>

<svelte:head>
	<title>公開前プレビュー | かざぐるま</title>
	<meta name="robots" content="noindex, nofollow, noarchive" />
</svelte:head>

{#if invalidToken}
	<section class="waiting" role="alert"><h1>プレビューを開けません</h1><p>Compassのホームページ編集から開き直してください。</p></section>
{:else if !content}
	<section class="waiting" aria-live="polite"><p class="eyebrow">PREVIEW</p><h1>Compassから内容を受け取っています</h1></section>
{:else}
	{#if hasOwnPage(content.kind)}
		<div class="view-switch" role="group" aria-label="プレビューする画面">
			<button type="button" class:active={view === 'page'} aria-pressed={view === 'page'} onclick={() => (view = 'page')}>個別ページ</button>
			<button type="button" class:active={view === 'list'} aria-pressed={view === 'list'} onclick={() => (view = 'list')}>一覧</button>
		</div>
	{/if}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div onclickcapture={followLink}>
	{#if shown === 'page' && content.kind === 'record'}<RecordPage data={{ content }} />
	{:else if shown === 'page'}<NewsArticlePage data={{ content }} />
	{:else if content.kind === 'work'}<WorksPage data={{ works: listWith(data.works, content) }} />
	{:else if content.kind === 'record'}<RecordsPage data={{ records: listWith(data.records, content) }} />
	{:else}<NewsPage data={{ news: listWith(data.news, content) }} />{/if}
	</div>
{/if}

<style>
	.waiting { max-width: 720px; min-height: 45vh; margin: 0 auto; padding: 3rem 1.25rem; border: 1px dashed var(--border); background: var(--card); text-align: center; }
	.waiting h1 { font-size: clamp(1.3rem, 4vw, 2rem); }
	/* The one thing here that is not part of the real page: which of the item's two pages to look at. */
	.view-switch { display: flex; width: fit-content; margin: 0 auto 1.5rem; border: 1px solid var(--border); background: var(--card); }
	.view-switch button { padding: .35rem .9rem; border: 0; color: var(--muted, inherit); background: transparent; font: inherit; font-size: .78rem; cursor: pointer; }
	.view-switch button + button { border-left: 1px solid var(--border); }
	.view-switch button.active { color: var(--card); background: var(--text, #222); }
</style>
