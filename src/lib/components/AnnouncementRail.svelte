<script lang="ts">
	import type { ContentSummary } from '$lib/types/content';
	let { items = [], newsUrl }: { items?: ContentSummary[]; newsUrl: string } = $props();
</script>

{#if items.length}
	<aside class="announcement" aria-label="お知らせ">
		<strong>お知らせ</strong>
		<div class="announcement-items">
			{#each items as item}
				<a href={item.url}><time datetime={item.date}>{item.date.slice(5).replace('-', '/')}</time><span>{item.title}</span><b aria-hidden="true">→</b></a>
			{/each}
			<a class="all-news" href={newsUrl}><span>すべて見る</span><b aria-hidden="true">→</b></a>
		</div>
	</aside>
{/if}

<style>
	.announcement { display: flex; width: 100%; min-width: 0; border-bottom: 1px solid var(--border); background: #f8f8fa; }
	.announcement > strong { display: grid; place-items: center; flex: 0 0 auto; padding: .65rem max(.8rem, calc((100vw - 1180px) / 2)); padding-right: .8rem; color: #202230; background: #ffda52; font-size: .7rem; }
	.announcement-items { display: flex; min-width: 0; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-color: #b7bbc8 transparent; scrollbar-width: thin; }
	.announcement-items::-webkit-scrollbar { height: 4px; }
	.announcement-items::-webkit-scrollbar-track { background: transparent; }
	.announcement-items::-webkit-scrollbar-thumb { border-radius: 999px; background: #b7bbc8; }
	a { display: flex; min-height: 44px; flex: 0 0 auto; align-items: center; gap: .55rem; padding: .55rem .85rem; border-right: 1px solid var(--border); color: var(--text); font-size: .75rem; text-decoration: none; white-space: nowrap; scroll-snap-align: start; }
	a:hover, a:focus-visible { background: #fff; }
	time { color: var(--faint); font: .64rem ui-monospace, monospace; }
	b { color: var(--accent); }
	@media (max-width: 720px) {
		.announcement > strong { padding-inline: .7rem; }
		.announcement-items { scrollbar-width: none; }
		.announcement-items::-webkit-scrollbar { display: none; }
		a { width: min(72vw, 260px); white-space: normal; line-height: 1.35; }
		a time { display: none; }
		.all-news { width: auto; }
	}
</style>
