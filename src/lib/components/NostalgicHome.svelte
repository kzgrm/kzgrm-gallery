<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { trackImageLoad } from '$lib/actions/trackImageLoad';
	import { langPath, t } from '$lib/i18n';
	import PinnedPhotoBoard from '$lib/components/PinnedPhotoBoard.svelte';
	import type { HomePinPhoto } from '$lib/home-pins';
	import type { ContentSummary } from '$lib/types/content';
	let { works, records, photos }: { works: ContentSummary[]; records: ContentSummary[]; photos: HomePinPhoto[] } = $props();
	const lang = $derived(page.data.lang ?? 'ja');
	const strings = $derived(t(lang).home);

	// Keyed by slug so each tile/entry fades in independently once its own
	// image actually arrives, instead of all popping in together on a timer.
	let workLoaded = $state<Record<string, boolean>>({});
	let recordLoaded = $state<Record<string, boolean>>({});
</script>

{#snippet workTile(work: ContentSummary, extraClass: string)}
	{#if work.externalUrl}
		<a class={`tile ${extraClass}`} href={work.externalUrl} target="_blank" rel="noopener noreferrer">
			{@render workArtwork(work)}
		</a>
	{:else}
		<div class={`tile ${extraClass}`}>
			{@render workArtwork(work)}
		</div>
	{/if}
{/snippet}

{#snippet workArtwork(work: ContentSummary)}
	{#if work.thumbnail}
		<img src={work.thumbnail} alt="" style={work.thumbnailFocus ? `object-position:${work.thumbnailFocus}` : undefined} class:loaded={workLoaded[work.slug]} use:trackImageLoad={() => (workLoaded[work.slug] = true)} />
	{/if}
	<span><strong>{work.title}</strong><time datetime={work.date}>{work.dateLabel}</time></span>
{/snippet}

<div class:with-photos={photos.length > 0} class="home-stage">
	<PinnedPhotoBoard {photos} />
	<div class="nostalgic-home">
	<section class="welcome"><span>WELCOME TO</span><h1><img src={`${base}/header.webp`} alt="かざぐるま（KZGRM）" /></h1></section>
	<section class="box">
		<h2>WORKS</h2>
		{#if works[0]}
			<div class="featured-work">{@render workTile(works[0], 'featured')}</div>
		{/if}
		<div class="work-groups">
			{#each [works.slice(1,5), works.slice(5,9)] as group, groupIndex}
				{#if group.length > 0}
					<div class="work-grid" class:reverse-size-order={groupIndex === 1}>
						{#each group as work, index (work.slug)}
							{@render workTile(work, index === 0 ? 'large' : '')}
						{/each}
					</div>
				{/if}
			{/each}
		</div>
		<a class="more" href={langPath(lang, '/works/')}>{strings.allWorks}</a>
	</section>
	<section class="box recent">
		<h2>ARTICLES</h2>
		<ul>{#each records as record,index}<li><a class="record-entry" href={record.url}>{#if record.thumbnail}<img src={record.thumbnail} alt="" class:loaded={recordLoaded[record.slug]} use:trackImageLoad={() => (recordLoaded[record.slug] = true)} />{/if}<span class="record-copy"><span class="record-meta"><time datetime={record.date}>{record.dateLabel}</time><em>{strings.recordBadge}</em>{#if index===0}<b>NEW</b>{/if}</span><strong>{record.title}</strong>{#if record.summary}<small>{record.summary}</small>{/if}</span></a></li>{/each}</ul>
		<a class="more" href={langPath(lang, '/records/')}>{strings.moreRecords}</a>
	</section>
	</div>
</div>

<style>
	.home-stage{width:100%}.home-stage.with-photos{display:grid;grid-template-columns:minmax(82px,95px) minmax(0,900px) minmax(82px,95px);grid-template-rows:repeat(5,auto);gap:1.35rem 1rem;align-items:start}.home-stage.with-photos .nostalgic-home{grid-column:2;grid-row:1/6}
	.nostalgic-home{width:min(900px,100%);margin:0 auto;padding:0 0 1rem;color:#172034;font-family:Verdana,'Yu Gothic',sans-serif}.welcome{padding:.6rem 0 .9rem;text-align:center}.welcome h1{margin:0;padding:0;border:0;font:inherit;letter-spacing:0}.welcome span{display:block;color:#596483;font:700 .62rem monospace;letter-spacing:.24em}.welcome img{display:block;width:min(330px,70%);margin:.25rem auto;mix-blend-mode:multiply}.box{margin-top:.85rem;padding:1rem;border:1px solid #4e5a80;background:rgba(255,255,255,.92);box-shadow:5px 5px 0 rgba(90,101,177,.2)}h1,h2{margin:0 0 .8rem;padding-bottom:.4rem;border-bottom:2px dotted #7d87a2;color:#303b78;font:800 .92rem monospace;letter-spacing:.08em}.work-groups{display:grid;gap:.5rem}.work-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;grid-auto-rows:140px;gap:.5rem}.tile{position:relative;display:block;overflow:hidden;border:1px solid #69728b;color:#fff;background:#252b3c}.work-grid>.tile.large{grid-row:span 2}.work-grid>.tile:nth-child(4){grid-column:2/4}.work-grid.reverse-size-order{grid-template-columns:1fr 1fr 1.3fr}.work-grid.reverse-size-order>.tile.large{grid-column:1/3;grid-row:1}.work-grid.reverse-size-order>.tile:nth-child(2){grid-column:1;grid-row:2}.work-grid.reverse-size-order>.tile:nth-child(3){grid-column:2;grid-row:2}.work-grid.reverse-size-order>.tile:nth-child(4){grid-column:3;grid-row:1/3}.featured-work{margin-bottom:.5rem}.featured-work>.tile{aspect-ratio:16/9}.tile img{width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.04);transition:opacity .45s ease,transform .45s ease}.tile img.loaded{opacity:1;transform:scale(1)}.tile>span{position:absolute;right:0;bottom:0;left:0;padding:.3rem .45rem;background:rgba(15,23,42,.8)}.tile strong,.tile time{display:block;overflow:hidden;font-size:.58rem;text-overflow:ellipsis;white-space:nowrap}.tile time{color:#dce2f2;font:.48rem monospace}.featured-work .tile>span{padding:.55rem .65rem}.featured-work strong{font-size:clamp(.78rem,1.5vw,1.05rem);white-space:normal}.featured-work time{margin-top:.2rem;font-size:.65rem}.more{display:block;margin-top:.7rem;color:#3e4d98;font-size:.72rem;text-align:right}ul{margin:0;padding:0;list-style:none}li{border-bottom:1px dotted #adb4c5}.record-entry{display:grid;grid-template-columns:8.5rem minmax(0,1fr);gap:.8rem;align-items:center;padding:.55rem .2rem;color:#303b78;text-decoration:none}.record-entry>img{width:100%;aspect-ratio:16/9;border:1px solid #69728b;object-fit:cover;opacity:0;transform:scale(1.04);transition:opacity .45s ease,transform .45s ease}.record-entry>img.loaded{opacity:1;transform:scale(1)}.record-copy{display:grid;min-width:0;gap:.28rem}.record-meta{display:flex;align-items:center;gap:.5rem}.record-meta time{color:#68728d;font:.65rem monospace}.record-meta em{padding:.13rem .3rem;color:#fff;background:#8060ad;font-size:.57rem;font-style:normal;text-align:center}.record-meta b{margin-left:auto;color:#d53255;font:700 .58rem monospace}.record-copy>strong{overflow:hidden;font-size:.76rem;text-decoration:underline;text-overflow:ellipsis;white-space:nowrap}.record-copy>small{display:-webkit-box;overflow:hidden;color:#596483;font-size:.62rem;line-height:1.5;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2}
	@media(max-width:620px){.home-stage.with-photos{display:flex;flex-direction:column}.home-stage.with-photos .nostalgic-home{order:1}}
	@media(min-width:1200px){.home-stage.with-photos{grid-template-columns:minmax(125px,150px) minmax(0,900px) minmax(125px,150px);column-gap:1.5rem}}
	@media(max-width:620px){.nostalgic-home{padding:.1rem .65rem 1rem}.welcome{padding:.45rem 0 .75rem}.welcome img{width:78%}.box{padding:.7rem;box-shadow:3px 3px 0 rgba(90,101,177,.2)}.work-grid,.work-grid.reverse-size-order{grid-template-columns:1fr 1fr;grid-template-rows:150px 110px 110px}.work-grid>.tile,.work-grid.reverse-size-order>.tile:nth-child(n){grid-column:auto;grid-row:auto}.work-grid>.tile.large,.work-grid.reverse-size-order>.tile.large,.work-grid>.tile:nth-child(4),.work-grid.reverse-size-order>.tile:nth-child(4){grid-column:1/3;grid-row:auto}.record-entry{grid-template-columns:6.5rem minmax(0,1fr);gap:.6rem}.record-meta b{display:none}.record-copy>small{-webkit-line-clamp:1;line-clamp:1}}
	@media(prefers-reduced-motion:reduce){.tile img,.record-entry>img{transition:none;opacity:1;transform:none}}
</style>
