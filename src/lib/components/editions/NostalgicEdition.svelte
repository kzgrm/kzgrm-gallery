<script lang="ts">
	import { base } from '$app/paths';
	import type { ContentSummary } from '$lib/types/content';
	let { works, records, onShuffle }: { works: ContentSummary[]; records: ContentSummary[]; onShuffle: () => void } = $props();
</script>

<div class="nostalgic-edition edition-home">
	<section class="welcome"><span>WELCOME TO</span><img src={`${base}/header.webp`} alt="かざぐるま" /><p>風下と、いろんな得意分野のメンバーがつくったもの。</p></section>
	<section class="box"><div class="box-heading"><h1>RANDOM WORKS</h1><button type="button" onclick={onShuffle}>↻ いれかえる</button></div><div class="work-grid">{#each works as work,index}<a class:large={index===0} href={work.externalUrl??work.url} target={work.externalUrl?'_blank':undefined} rel={work.externalUrl?'noopener noreferrer':undefined}>{#if work.thumbnail}<img src={work.thumbnail} alt="" />{/if}<span><strong>{work.title}</strong><time>{work.dateLabel}</time></span></a>{/each}</div><a class="more" href={`${base}/works/`}>≫ 作品をぜんぶ見る</a></section>
	<section class="box recent"><h2>最近の記事</h2><ul>{#each records as record,index}<li><time>{record.dateLabel}</time><span>制作記録</span><a href={record.url}>{record.title}</a>{#if index===0}<b>NEW</b>{/if}</li>{/each}</ul><a class="more" href={`${base}/records/`}>≫ もっと読む</a></section>
</div>

<style>
	.nostalgic-edition{width:min(760px,100%);margin:0 auto;padding:1rem 0 3rem;color:#172034;font-family:Verdana,'Yu Gothic',sans-serif}.welcome{padding:1.1rem 0 1.4rem;text-align:center}.welcome span{display:block;color:#596483;font:700 .62rem monospace;letter-spacing:.24em}.welcome img{display:block;width:min(330px,70%);margin:.25rem auto;mix-blend-mode:multiply}.welcome p{margin:0;font-size:.76rem}
	.box{margin-top:1.25rem;padding:1rem;border:1px solid #4e5a80;background:rgba(255,255,255,.92);box-shadow:5px 5px 0 rgba(90,101,177,.2)}.box-heading{display:flex;align-items:center;justify-content:space-between}h1,h2{margin:0 0 .8rem;padding-bottom:.4rem;border-bottom:2px dotted #7d87a2;color:#303b78;font:800 .92rem monospace;letter-spacing:.08em}.box-heading h1{flex:1}button{margin:0 0 .8rem .7rem;padding:.25rem .55rem;border:1px solid #707b9a;border-radius:0;background:#f2f0e8;color:#25315b;font:.68rem monospace;box-shadow:2px 2px 0 #9da4b6;cursor:pointer}
	.work-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;grid-template-rows:repeat(2,120px);gap:.5rem}.work-grid>a{position:relative;overflow:hidden;border:1px solid #69728b;color:#fff;background:#252b3c}.work-grid>a.large{grid-row:1/3}.work-grid>a:last-child{grid-column:2/4}.work-grid img{width:100%;height:100%;object-fit:cover}.work-grid a>span{position:absolute;right:0;bottom:0;left:0;padding:.4rem .5rem;background:rgba(15,23,42,.8)}.work-grid strong,.work-grid time{display:block;overflow:hidden;font-size:.68rem;text-overflow:ellipsis;white-space:nowrap}.work-grid time{color:#dce2f2;font:.56rem monospace}.more{display:block;margin-top:.7rem;color:#3e4d98;font-size:.72rem;text-align:right}
	ul{margin:0;padding:0;list-style:none}li{display:grid;grid-template-columns:6rem 4.5rem 1fr auto;align-items:center;gap:.5rem;padding:.55rem .2rem;border-bottom:1px dotted #adb4c5;font-size:.72rem}li time{color:#68728d;font:.65rem monospace}li>span{padding:.13rem .3rem;color:#fff;background:#8060ad;font-size:.57rem;text-align:center}li a{color:#303b78}li b{color:#d53255;font:700 .58rem monospace}
	@media(max-width:620px){.nostalgic-edition{padding:.2rem .65rem 3rem}.welcome img{width:78%}.box{padding:.7rem;box-shadow:3px 3px 0 rgba(90,101,177,.2)}.work-grid{grid-template-columns:1fr 1fr;grid-template-rows:150px 110px 110px}.work-grid>a.large{grid-column:1/3;grid-row:auto}.work-grid>a:last-child{grid-column:1/3}li{grid-template-columns:5rem 4rem 1fr}li b{display:none}}
</style>
