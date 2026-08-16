<script lang="ts">
	import portrait from '../../assets/images/about/kzsm.jpg?url';
</script>

<svelte:head>
	<title>私たちについて | かざぐるま</title>
	<meta name="description" content="サークル、かざぐるまについて。" />
</svelte:head>

<header class="page-heading">
	<p class="eyebrow">About us</p>
	<h1>私たちについて</h1>
	<p>かざぐるまというサークルのホームページです。</p>
</header>

<section class="character" style={`--portrait: url('${portrait}')`}>
	<div>
		<p class="eyebrow">Character</p>
		<h2>風下 <small>kazashimo</small></h2>
		<ul>
			<li><a href="https://www.youtube.com/@kazashimo_ch" target="_blank" rel="noopener noreferrer">YouTube <span>@kazashimo_ch</span></a></li>
			<li><a href="https://x.com/haru01234567890" target="_blank" rel="noopener noreferrer">X <span>@haru01234567890</span></a></li>
			<li><a href="https://www.tiktok.com/@kazashimo9346" target="_blank" rel="noopener noreferrer">TikTok <span>@kazashimo9346</span></a></li>
			<li><a href="https://www.amazon.co.jp/hz/wishlist/ls/2PZZB1ZGEC13D?ref_=wl_share" target="_blank" rel="noopener noreferrer">Amazon <span>ほしい物リスト</span></a></li>
		</ul>
	</div>
</section>

<div class="info-grid">
	<section>
		<p class="eyebrow">Members</p>
		<h2>メンバー</h2>
		<ul class="members"><li>はる</li><li>ふぉるね</li><li>ウィンダル</li><li>なっつ</li></ul>
	</section>
	<section>
		<p class="eyebrow">Contact</p>
		<h2>連絡先</h2>
		<p>お問い合わせ窓口は現在準備中です。</p>
	</section>
</div>

<style>
	.character { position: relative; min-height: 420px; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); box-shadow: var(--shadow-sm); isolation: isolate; }
	.character::before { position: absolute; inset: 0; z-index: -2; background: var(--portrait) center 30% / cover no-repeat; content: ''; }
	.character::after { position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.9) 43%, rgba(255,255,255,.08) 78%); content: ''; }
	.character > div { width: min(52%, 520px); padding: clamp(1.5rem, 5vw, 3.5rem); }
	.character h2 { margin: 0; font-size: clamp(2rem, 5vw, 3.3rem); }
	.character h2 small { display: block; color: var(--muted); font-size: .8rem; font-weight: 500; letter-spacing: .14em; }
	.character ul { display: grid; gap: .5rem; margin: 2rem 0 0; padding: 0; list-style: none; }
	.character a { display: flex; justify-content: space-between; gap: .75rem; padding: .55rem .7rem; border: 1px solid rgba(219,225,234,.8); border-radius: 9px; color: var(--text); background: rgba(255,255,255,.76); text-decoration: none; }
	.character a:hover { border-color: var(--accent); }
	.character a span { color: var(--muted); font-size: .85rem; }
	.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
	.info-grid section { padding: 1.5rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
	.info-grid h2 { margin: 0; }
	.info-grid p:last-child { color: var(--muted); }
	.members { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1rem 0 0; padding: 0; list-style: none; }
	.members li { padding: .35rem .7rem; border-radius: 999px; background: var(--accent-soft); color: var(--accent-strong); }
	@media (max-width: 680px) {
		.character { min-height: 560px; }
		.character::before { background-position: 60% center; }
		.character::after { background: linear-gradient(180deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.9) 55%, rgba(255,255,255,.15) 85%); }
		.character > div { width: 100%; }
		.info-grid { grid-template-columns: 1fr; }
	}
</style>
