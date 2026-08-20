<script lang="ts">
	import type { SiteContent } from '$lib/types/content';
	let { content, backUrl, backLabel, eyebrow }: { content: SiteContent; backUrl: string; backLabel: string; eyebrow: string } = $props();
</script>

<article class="article">
	<a class="back" href={backUrl}>← {backLabel}</a>
	<header>
		<p class="eyebrow">{eyebrow}</p>
		<h1>{content.title}</h1>
		<div class="meta">
			<time datetime={content.date}>{content.dateLabel}</time>
			{#if content.author}<span>文：{content.author}</span>{/if}
			{#if content.tags.length}<span>{content.tags.join(' / ')}</span>{/if}
		</div>
	</header>
	<div class="prose content">{@html content.html}</div>
</article>

<style>
	.article { max-width: 820px; margin: 0 auto; }
	.back { display: inline-flex; margin-bottom: 2rem; color: var(--accent-strong); font-size: .85rem; }
	header { padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	h1 { margin: 0; font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.25; }
	.meta { display: flex; flex-wrap: wrap; gap: .6rem 1.25rem; margin-top: 1rem; color: var(--faint); font-size: .8rem; }
	.meta span:last-child { color: var(--accent); }
	.content { padding-top: 1.5rem; }
</style>
