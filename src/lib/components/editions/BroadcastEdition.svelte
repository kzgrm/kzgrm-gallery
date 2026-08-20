<script lang="ts">
	import { base } from '$app/paths';
	import type { ContentSummary } from '$lib/types/content';
	let { works, records }: { works: ContentSummary[]; records: ContentSummary[] } = $props();
	let selected = $state(0);
</script>

<div class="broadcast-edition edition-home">
	<header><b>KZGRM</b><strong>CHANNEL</strong><span>ON AIR ●</span></header>
	<div class="screen"><a class="player" href={works[selected]?.externalUrl??works[selected]?.url}>{#if works[selected]?.thumbnail}<img src={works[selected].thumbnail} alt="" />{/if}<i>PROGRAM 0{selected+1}</i><span><strong>{works[selected]?.title}</strong><time>{works[selected]?.dateLabel}</time></span></a><nav aria-label="番組一覧">{#each works.slice(0,5) as work,index}<button class:active={selected===index} type="button" onclick={() => selected=index}><b>0{index+1}</b>{#if work.thumbnail}<img src={work.thumbnail} alt="" />{/if}<span>{work.title}<time>{work.dateLabel}</time></span></button>{/each}</nav></div>
	<div class="ticker"><b>NEWS</b><p>{records.map((record)=>`${record.dateLabel}　${record.title}`).join('　　◆　　')}</p></div>
	<a class="archive" href={`${base}/works/`}>ALL PROGRAMS →</a>
</div>

<style>
	.broadcast-edition{color:#f6f1df;background:#111;font-family:Arial,sans-serif}.broadcast-edition>header{display:flex;align-items:baseline;gap:1rem;padding:1rem 1.3rem;border-bottom:5px solid #f1d233}.broadcast-edition>header b{color:#f1d233;font-size:clamp(2rem,7vw,5rem);font-style:italic;letter-spacing:-.08em}.broadcast-edition>header strong{font-size:clamp(1rem,3vw,2rem)}.broadcast-edition>header span{margin-left:auto;color:#ff4a3b;font:bold 11px monospace}.screen{display:grid;grid-template-columns:2fr 1fr;gap:1px;background:#f1d233}.player{position:relative;display:block;color:#fff;background:#000;text-decoration:none}.player>img{display:block;width:100%;aspect-ratio:16/9;opacity:.8;object-fit:cover}.player i{position:absolute;top:1rem;left:1rem;padding:.3rem .6rem;color:#111;background:#f1d233;font:bold 10px monospace;font-style:normal}.player>span{position:absolute;right:0;bottom:0;left:0;display:flex;flex-direction:column;padding:3rem 1rem 1rem;background:linear-gradient(transparent,#000)}.player strong{font-size:clamp(1.4rem,4vw,3rem);line-height:1.05}.screen nav{background:#111}.screen button{display:grid;width:100%;grid-template-columns:35px 75px 1fr;gap:.6rem;align-items:center;padding:.65rem;border:0;border-bottom:1px solid #444;color:#fff;background:#111;text-align:left;cursor:pointer}.screen button.active{background:#29250e}.screen button>b{color:#f1d233}.screen button img{width:75px;aspect-ratio:16/9;object-fit:cover}.screen button span{font-size:10px}.screen button time{display:block;color:#999}.ticker{display:flex;overflow:hidden;border-top:1px solid #f1d233}.ticker>b{z-index:1;padding:.5rem 1rem;color:#111;background:#f1d233}.ticker p{margin:0;padding:.5rem;white-space:nowrap;animation:ticker 25s linear infinite}.archive{display:block;padding:1rem;color:#f1d233;font-weight:900;text-align:right}@keyframes ticker{to{transform:translateX(-70%)}}
	@media(max-width:620px){.broadcast-edition>header{gap:.5rem}.screen{grid-template-columns:1fr}.screen button{grid-template-columns:30px 70px 1fr}}
	@media(prefers-reduced-motion:reduce){.ticker p{animation:none}}
</style>
