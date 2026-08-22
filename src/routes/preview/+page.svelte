<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import ContentArticle from '$lib/components/ContentArticle.svelte';
	import WorkFilter from '$lib/components/WorkFilter.svelte';
	import { decodePreviewMessage, previewMessageType, validPreviewToken } from '$lib/preview-contract.js';
	import { renderPreviewMarkdown } from '$lib/preview-markdown';
	import { homepagePreviewState } from '$lib/preview-state.svelte';
	import type { ContentKind, SiteContent } from '$lib/types/content';

	type PreviewContent = {
		slug: string; title: string; date: string; kind: ContentKind; tags: string[]; summary: string; caption: string;
		author: string; externalUrl: string; rail: boolean; body: string; thumbnailUrl: string; assetBaseUrl: string;
	};
	let content = $state<SiteContent | null>(null);
	let invalidToken = $state(false);
	const labels: Record<ContentKind, { back: string; eyebrow: string; collection: string }> = {
		work: { back: '作品一覧へ', eyebrow: 'Work', collection: 'works' },
		record: { back: '記録一覧へ', eyebrow: 'Record', collection: 'records' },
		news: { back: 'お知らせ一覧へ', eyebrow: 'News', collection: 'news' }
	};
	const dateLabel = (date: string) => date.split('-').map(Number).join('/');
	function siteContent(value: PreviewContent): SiteContent {
		return {
			slug: value.slug, title: value.title, date: value.date, dateLabel: dateLabel(value.date), kind: value.kind, tags: value.tags,
			thumbnail: value.thumbnailUrl || undefined, summary: value.summary || undefined, caption: value.caption || undefined,
			author: value.author || undefined, externalUrl: value.externalUrl || undefined, rail: value.rail, listed: true,
			publicationState: 'draft', url: `${base}/preview/`, html: renderPreviewMarkdown(value.body, value.assetBaseUrl)
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
	{#if content.kind === 'work'}
		<section class="card-preview" aria-label="作品一覧での表示">
			<p class="eyebrow">作品一覧での表示</p>
			<div class="noninteractive"><WorkFilter works={[content]} /></div>
		</section>
	{/if}
	<ContentArticle content={content} backUrl={`${base}/${labels[content.kind].collection}/`} backLabel={labels[content.kind].back} eyebrow={labels[content.kind].eyebrow} />
{/if}

<style>
	.waiting { max-width: 720px; min-height: 45vh; margin: 0 auto; padding: 3rem 1.25rem; border: 1px dashed var(--border); background: var(--card); text-align: center; }
	.waiting h1 { font-size: clamp(1.3rem, 4vw, 2rem); }
	.card-preview { max-width: 820px; margin: 0 auto 3rem; padding-bottom: 2rem; border-bottom: 3px double var(--border); }
	.noninteractive { pointer-events: none; }
	@media (max-width: 560px) { .card-preview { margin-bottom: 2rem; } }
</style>
