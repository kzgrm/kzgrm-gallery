<script lang="ts">
	import { base } from '$app/paths';
	import type { ContentSummary } from '$lib/types/content';
	let { works, records }: { works: ContentSummary[]; records: ContentSummary[] } = $props();
</script>

<div class="manga-edition edition-home">
	<header><span>KAZAGURUMA</span><b>かざぐるま</b><small>第1号</small></header>
	<section class="panels" aria-label="作品">{#each works.slice(0,5) as work,index}<a class:wide={index===0} href={work.externalUrl??work.url} target={work.externalUrl?'_blank':undefined} rel={work.externalUrl?'noopener noreferrer':undefined}>{#if work.thumbnail}<img src={work.thumbnail} alt="" />{/if}<i></i><em>{index+1}</em><strong>{work.title}</strong><time>{work.dateLabel}</time></a>{/each}</section>
	<section class="records"><h2>最近の記録</h2>{#each records as record}<a href={record.url}><time>{record.dateLabel}</time><strong>{record.title}</strong></a>{/each}</section>
	<a class="next" href={`${base}/works/`}>作品一覧へ　→</a>
</div>

<style>
	.manga-edition{padding:clamp(.7rem,3vw,2rem);color:#000;background-color:#fff;background-image:radial-gradient(#bbb .7px,transparent .7px);background-size:5px 5px;font-family:'Arial Black','Yu Gothic',sans-serif}.manga-edition>header{display:flex;align-items:end;gap:1rem;padding-bottom:.6rem;border-bottom:8px solid;transform:rotate(-1deg)}.manga-edition>header span{font:bold 9px monospace;writing-mode:vertical-rl}.manga-edition>header b{font-size:clamp(2.6rem,10vw,7rem);line-height:.85;letter-spacing:-.1em}.manga-edition>header small{margin-left:auto}.panels{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:1rem}.panels a{position:relative;min-height:250px;overflow:hidden;border:5px solid #000;color:#000;background:#fff;text-decoration:none}.panels a.wide{grid-column:1/-1;min-height:400px}.panels img{width:100%;height:100%;filter:grayscale(1) contrast(1.35);object-fit:cover}.panels i{position:absolute;inset:0;background:radial-gradient(#000 1px,transparent 1px);background-size:5px 5px;mix-blend-mode:multiply;opacity:.25}.panels em{position:absolute;top:0;left:0;padding:.1rem .5rem;color:#fff;background:#000;font-style:normal}.panels strong{position:absolute;right:.6rem;bottom:2rem;left:.6rem;padding:.35rem .5rem;background:#fff;box-shadow:5px 5px #000;font-size:clamp(1rem,3vw,2rem);line-height:1.1;transform:rotate(-1deg)}.panels time{position:absolute;right:.4rem;bottom:.3rem;padding:0 .3rem;background:#fff;font:bold 10px monospace}.records{margin-top:1rem;border:5px solid;background:#fff}.records h2{margin:0;padding:.4rem;border-bottom:4px solid}.records a{display:grid;grid-template-columns:7rem 1fr;padding:.5rem;border-bottom:1px solid;color:#000;text-decoration:none}.records time{font:11px monospace}.next{display:block;margin-top:1rem;padding:.5rem;border:4px solid;color:#000;background:#fff;font-weight:900;text-align:right;text-decoration:none}
	@media(max-width:620px){.panels{grid-template-columns:1fr}.panels a.wide{grid-column:auto;min-height:330px}.records a{grid-template-columns:1fr}}
</style>
