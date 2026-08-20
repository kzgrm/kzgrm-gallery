<script lang="ts">
	import { base } from '$app/paths';
	import type { ContentSummary } from '$lib/types/content';
	let { works, records }: { works: ContentSummary[]; records: ContentSummary[] } = $props();
</script>

<div class="zine-edition edition-home">
	<header><p>ISSUE 001 / KAZASHIMO ARCHIVE</p><img src={`${base}/header.webp`} alt="かざぐるま" /></header>
	<section class="collage" aria-label="作品">{#each works.slice(0,4) as work,index}<a class={`piece piece-${index+1}`} href={work.externalUrl??work.url} target={work.externalUrl?'_blank':undefined} rel={work.externalUrl?'noopener noreferrer':undefined}>{#if work.thumbnail}<img src={work.thumbnail} alt="" />{/if}<span><b>0{index+1}</b><strong>{work.title}</strong></span></a>{/each}</section>
	<div class="tape">WORKS SELECTED FROM THE ARCHIVE</div>
	<section class="notes"><div><span>LATEST NOTES</span><h2>最近の記録</h2></div><ol>{#each records as record}<li><time>{record.dateLabel}</time><a href={record.url}>{record.title}</a></li>{/each}</ol><a class="all" href={`${base}/records/`}>READ ALL →</a></section>
</div>

<style>
	.zine-edition{position:relative;width:min(1020px,100%);margin:0 auto;padding:2rem clamp(1rem,4vw,3rem) 5rem;overflow:hidden;color:#171717;background:#efe5c9;background-image:radial-gradient(#b4a989 1px,transparent 1px);background-size:5px 5px;font-family:Georgia,'Yu Mincho',serif;box-shadow:0 0 0 1px #a1977c}.zine-edition>header{position:relative;min-height:150px;border-bottom:7px solid #171717}.zine-edition>header p{margin:0;font:700 .65rem monospace;letter-spacing:.16em}.zine-edition>header img{width:min(330px,52%);margin-top:1.2rem;mix-blend-mode:multiply;transform:rotate(-2deg)}
	.collage{display:grid;grid-template-columns:1.35fr .85fr 1fr;grid-template-rows:190px 170px;gap:1rem;margin-top:1.6rem}.piece{position:relative;overflow:hidden;border:6px solid #fff9ec;color:#fff;background:#222;box-shadow:5px 6px 0 #242424;transform:rotate(-1.2deg)}.piece-1{grid-row:1/3}.piece-2{transform:rotate(1.8deg)}.piece-3{transform:rotate(-2deg)}.piece-4{grid-column:2/4;transform:rotate(.8deg)}.piece img{width:100%;height:100%;object-fit:cover;filter:saturate(.88) contrast(1.04)}.piece span{position:absolute;right:0;bottom:0;left:0;display:flex;align-items:end;gap:.5rem;padding:.55rem;background:linear-gradient(transparent,rgba(0,0,0,.85))}.piece b{font:700 1.35rem monospace}.piece strong{font-size:.78rem}.tape{width:max-content;margin:-5px auto 0;padding:.35rem 1.5rem;background:#e7bd16cc;font:700 .65rem monospace;letter-spacing:.08em;transform:rotate(-1deg)}
	.notes{display:grid;grid-template-columns:.8fr 1.5fr auto;gap:1.5rem;align-items:start;margin-top:2.2rem;padding-top:1.2rem;border-top:2px solid #171717}.notes span{font:700 .6rem monospace;letter-spacing:.15em}.notes h2{margin:.2rem 0 0;color:#a24f69;font-size:1.6rem}ol{margin:0;padding:0;list-style:none}li{display:grid;grid-template-columns:6rem 1fr;gap:1rem;padding:.45rem 0;border-bottom:1px solid #9c9278}li time{font:.65rem monospace}li a{color:#171717;font-size:.8rem}.all{color:#283260;font:700 .65rem monospace}
	@media(max-width:620px){.zine-edition{padding:1rem .8rem 4rem}.zine-edition>header{min-height:130px}.zine-edition>header img{width:72%}.collage{grid-template-columns:1fr 1fr;grid-template-rows:170px 130px 130px;gap:.6rem}.piece{border-width:4px;box-shadow:3px 4px 0 #242424}.piece-1{grid-column:1/3;grid-row:auto}.piece-4{grid-column:1/3}.notes{grid-template-columns:1fr;gap:.8rem}}
</style>
