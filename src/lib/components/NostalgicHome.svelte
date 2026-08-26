<script lang="ts">
	import { base } from '$app/paths';
	import PinnedPhotoBoard from '$lib/components/PinnedPhotoBoard.svelte';
	import type { HomePinPhoto } from '$lib/home-pins';
	import type { ContentSummary } from '$lib/types/content';
	let { works, records, photos }: { works: ContentSummary[]; records: ContentSummary[]; photos: HomePinPhoto[] } = $props();
</script>

<div class:with-photos={photos.length > 0} class="home-stage">
	<PinnedPhotoBoard {photos} />
	<div class="nostalgic-home">
	<section class="welcome"><span>WELCOME TO</span><img src={`${base}/header.webp`} alt="かざぐるま" /></section>
	<section class="box">
		<h1>WORKS</h1>
		<div class="work-grid">{#each works.slice(0,4) as work,index}<a class:large={index===0} href={work.externalUrl??work.url} target={work.externalUrl?'_blank':undefined} rel={work.externalUrl?'noopener noreferrer':undefined}>{#if work.thumbnail}<img src={work.thumbnail} alt="" />{/if}<span><strong>{work.title}</strong><time datetime={work.date}>{work.dateLabel}</time></span></a>{/each}</div>
		<a class="more" href={`${base}/works/`}>≫ 作品をぜんぶ見る</a>
	</section>
	<section class="box recent">
		<h2>最近の記録</h2>
		<ul>{#each records as record,index}<li><a class="record-entry" href={record.url}>{#if record.thumbnail}<img src={record.thumbnail} alt="" />{/if}<span class="record-copy"><span class="record-meta"><time datetime={record.date}>{record.dateLabel}</time><em>制作記録</em>{#if index===0}<b>NEW</b>{/if}</span><strong>{record.title}</strong>{#if record.summary}<small>{record.summary}</small>{/if}</span></a></li>{/each}</ul>
		<a class="more" href={`${base}/records/`}>≫ もっと読む</a>
	</section>
	</div>
</div>

<style>
	.home-stage{width:100%}.home-stage.with-photos{display:grid;grid-template-columns:minmax(82px,95px) minmax(0,900px) minmax(82px,95px);grid-template-rows:repeat(5,auto);gap:1.35rem 1rem;align-items:start}.home-stage.with-photos .nostalgic-home{grid-column:2;grid-row:1/6}
	.nostalgic-home{width:min(900px,100%);margin:0 auto;padding:0 0 1rem;color:#172034;font-family:Verdana,'Yu Gothic',sans-serif}.welcome{padding:.6rem 0 .9rem;text-align:center}.welcome span{display:block;color:#596483;font:700 .62rem monospace;letter-spacing:.24em}.welcome img{display:block;width:min(330px,70%);margin:.25rem auto;mix-blend-mode:multiply}.box{margin-top:.85rem;padding:1rem;border:1px solid #4e5a80;background:rgba(255,255,255,.92);box-shadow:5px 5px 0 rgba(90,101,177,.2)}h1,h2{margin:0 0 .8rem;padding-bottom:.4rem;border-bottom:2px dotted #7d87a2;color:#303b78;font:800 .92rem monospace;letter-spacing:.08em}.work-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;grid-template-rows:repeat(2,140px);gap:.5rem}.work-grid>a{position:relative;overflow:hidden;border:1px solid #69728b;color:#fff;background:#252b3c}.work-grid>a.large{grid-row:1/3}.work-grid>a:last-child{grid-column:2/4}.work-grid img{width:100%;height:100%;object-fit:cover}.work-grid a>span{position:absolute;right:0;bottom:0;left:0;padding:.4rem .5rem;background:rgba(15,23,42,.8)}.work-grid strong,.work-grid time{display:block;overflow:hidden;font-size:.68rem;text-overflow:ellipsis;white-space:nowrap}.work-grid time{color:#dce2f2;font:.56rem monospace}.more{display:block;margin-top:.7rem;color:#3e4d98;font-size:.72rem;text-align:right}ul{margin:0;padding:0;list-style:none}li{border-bottom:1px dotted #adb4c5}.record-entry{display:grid;grid-template-columns:8.5rem minmax(0,1fr);gap:.8rem;align-items:center;padding:.55rem .2rem;color:#303b78;text-decoration:none}.record-entry>img{width:100%;aspect-ratio:16/9;border:1px solid #69728b;object-fit:cover}.record-copy{display:grid;min-width:0;gap:.28rem}.record-meta{display:flex;align-items:center;gap:.5rem}.record-meta time{color:#68728d;font:.65rem monospace}.record-meta em{padding:.13rem .3rem;color:#fff;background:#8060ad;font-size:.57rem;font-style:normal;text-align:center}.record-meta b{margin-left:auto;color:#d53255;font:700 .58rem monospace}.record-copy>strong{overflow:hidden;font-size:.76rem;text-decoration:underline;text-overflow:ellipsis;white-space:nowrap}.record-copy>small{display:-webkit-box;overflow:hidden;color:#596483;font-size:.62rem;line-height:1.5;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2}
	@media(max-width:620px){.home-stage.with-photos{display:flex;flex-direction:column}.home-stage.with-photos .nostalgic-home{order:1}}
	@media(max-width:620px){.nostalgic-home{padding:.1rem .65rem 1rem}.welcome{padding:.45rem 0 .75rem}.welcome img{width:78%}.box{padding:.7rem;box-shadow:3px 3px 0 rgba(90,101,177,.2)}.work-grid{grid-template-columns:1fr 1fr;grid-template-rows:150px 110px 110px}.work-grid>a.large{grid-column:1/3;grid-row:auto}.work-grid>a:last-child{grid-column:1/3}.record-entry{grid-template-columns:6.5rem minmax(0,1fr);gap:.6rem}.record-meta b{display:none}.record-copy>small{-webkit-line-clamp:1;line-clamp:1}}
</style>
