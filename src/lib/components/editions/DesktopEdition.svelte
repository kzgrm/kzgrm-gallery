<script lang="ts">
	import { base } from '$app/paths';
	import type { ContentSummary } from '$lib/types/content';
	let { works, records }: { works: ContentSummary[]; records: ContentSummary[] } = $props();
</script>

<div class="desktop-edition edition-home">
	<div class="icons"><a href={`${base}/works/`}><b>▤</b>WORKS.EXE</a><a href={`${base}/about/`}><b>☺</b>ABOUT.TXT</a><a href={`${base}/gallery/`}><b>▧</b>PHOTO.DIR</a></div>
	<section class="window"><header><strong>KAZAGURUMA / WORKS</strong><span>_ □ ×</span></header><nav>File　View　Help</nav><div class="files">{#each works.slice(0,6) as work}<a href={work.externalUrl??work.url} target={work.externalUrl?'_blank':undefined} rel={work.externalUrl?'noopener noreferrer':undefined}>{#if work.thumbnail}<img src={work.thumbnail} alt="" />{/if}<span><strong>{work.title}</strong><time>{work.dateLabel}</time></span></a>{/each}</div><footer>{works.slice(0,6).length} object(s)</footer></section>
	<section class="notepad"><header><strong>RECENT.TXT</strong><span>_ □ ×</span></header><ul>{#each records as record}<li><time>{record.dateLabel}</time>　<a href={record.url}>{record.title}</a></li>{/each}</ul></section>
	<div class="taskbar"><b>◆ START</b><span>KAZAGURUMA</span><time>12:34</time></div>
</div>

<style>
	.desktop-edition{position:relative;min-height:700px;overflow:hidden;color:#000;background:#278d89;font-family:'Courier New',monospace}.icons{display:grid;width:100px;gap:18px;padding:24px}.icons a{display:grid;justify-items:center;color:#fff;font-size:10px;text-decoration:none;text-shadow:1px 1px #000}.icons b{font-size:38px;line-height:1.1}.window,.notepad{position:absolute;border:3px outset #eee;background:#c0c0c0;box-shadow:7px 7px #0005}.window{top:35px;right:4%;width:72%}.notepad{right:12%;bottom:48px;width:48%}.window header,.notepad header{display:flex;justify-content:space-between;margin:3px;padding:3px 6px;color:#fff;background:#000080;font-size:12px}.window nav,.window footer{padding:3px 8px;border-bottom:2px groove #fff;font-size:11px}.window footer{border-top:2px groove #fff;border-bottom:0}.files{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:13px;background:#fff}.files a{color:#000;text-decoration:none}.files img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}.files a>span{display:flex;flex-direction:column}.files strong{font-size:10px}.files time{font-size:9px}.notepad ul{min-height:100px;margin:0;padding:8px 22px;background:#fff;font-size:10px}.notepad a{color:#000080}.taskbar{position:absolute;right:0;bottom:0;left:0;display:flex;gap:4px;padding:4px;border-top:3px outset #fff;background:#c0c0c0}.taskbar>*{padding:3px 8px;border:2px outset #fff;font-size:11px}.taskbar span{flex:1}
	@media(max-width:620px){.desktop-edition{min-height:780px}.icons{grid-template-columns:repeat(3,1fr);width:100%;padding:12px}.window{top:125px;right:7px;left:7px;width:auto}.files{grid-template-columns:1fr}.files a{display:grid;grid-template-columns:75px 1fr;gap:8px}.files img{width:75px}.notepad{right:18px;bottom:48px;width:76%}}
</style>
