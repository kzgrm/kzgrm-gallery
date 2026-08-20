<script lang="ts">
	import { base } from '$app/paths';
	import { siteEditions, type SiteEditionId } from '$lib/types/site-edition';
	let { active, onSelect, onRandom }: { active: SiteEditionId; onSelect: (id: SiteEditionId) => void; onRandom: () => void } = $props();
	let open = $state(false);
</script>

<aside class="edition-switcher" aria-label="サイト版の切り替え">
	{#if open}<div class="edition-panel">
		<div class="panel-heading"><div><strong>別の風下を見る</strong><small>同じ公式サイトの、ちがう見え方。</small></div><button class="close" type="button" onclick={() => open = false} aria-label="閉じる">×</button></div>
		<div class="edition-list">{#each siteEditions as edition}<button class:active={active === edition.id} type="button" onclick={() => { onSelect(edition.id); open = false; }}><span class={`swatch ${edition.id}`}></span><span><strong>{edition.name}</strong><small>{edition.description}</small></span>{#if active === edition.id}<b>いま表示中</b>{/if}</button>{/each}</div>
		<button class="random" type="button" onclick={() => { onRandom(); open = false; }}>↻ おまかせで別の風下へ</button>
	</div>{/if}
	<button class="pinwheel" class:open type="button" aria-expanded={open} onclick={() => open = !open}><img src={`${base}/favicon.svg`} alt="" /><span>サイト版</span></button>
</aside>

<style>
	.edition-switcher { position: fixed; z-index: 30; right: 1rem; bottom: 1rem; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
	.pinwheel { display:flex;align-items:center;gap:.45rem;min-height:44px;padding:.38rem .75rem .38rem .42rem;border:2px solid #202432;border-radius:999px;color:#202432;background:#fffdf7;box-shadow:3px 3px 0 #202432;cursor:pointer; }
	.pinwheel img { width:30px;height:30px;transition:transform .35s ease; }.pinwheel:hover img,.pinwheel.open img{transform:rotate(90deg)}.pinwheel span{font-size:.72rem;font-weight:800}
	.edition-panel{position:absolute;right:0;bottom:calc(100% + .75rem);width:min(350px,calc(100vw - 2rem));overflow:hidden;border:2px solid #202432;background:#fff;box-shadow:5px 5px 0 #202432;color:#172034}
	.panel-heading{display:flex;justify-content:space-between;gap:1rem;padding:.8rem;border-bottom:1px solid #bac2d3;background:#f6f4eb}.panel-heading strong,.panel-heading small{display:block}.panel-heading small{margin-top:.15rem;color:#5f687c;font-size:.65rem}.close{align-self:start;border:0;background:transparent;font-size:1.3rem;cursor:pointer}
	.edition-list{display:grid}.edition-list>button{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:.65rem;padding:.65rem .8rem;border:0;border-bottom:1px dotted #aeb5c4;color:#172034;background:#fff;text-align:left;cursor:pointer}.edition-list>button:hover,.edition-list>button.active{background:#f3f4fa}.edition-list strong,.edition-list small{display:block}.edition-list small{color:#68728d;font-size:.62rem}.edition-list b{color:#5362a4;font-size:.58rem}
	.swatch{display:block;width:42px;aspect-ratio:1;border:1px solid #202432}.swatch.nostalgic{background-color:#fbfaf4;background-image:linear-gradient(#cfd7e5 1px,transparent 1px),linear-gradient(90deg,#cfd7e5 1px,transparent 1px);background-size:8px 8px}.swatch.zine{background:linear-gradient(145deg,#f3e4b6 0 42%,#283260 43% 67%,#d76c8a 68%)}.swatch.playroom{background:linear-gradient(90deg,#17192b 50%,#242846 50%);box-shadow:inset 0 0 0 6px #ffda52}
	.random{width:100%;padding:.75rem;border:0;color:#fff;background:#5362a4;font-weight:800;cursor:pointer}
	@media(max-width:560px){.edition-switcher{right:.7rem;bottom:.7rem}.pinwheel span{display:none}.pinwheel{width:46px;height:46px;justify-content:center;padding:0;box-shadow:2px 2px 0 #202432}}
</style>
