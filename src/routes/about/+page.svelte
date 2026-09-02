<script lang="ts">
	import { trackImageLoad } from '$lib/actions/trackImageLoad';
	import portrait from '../../assets/images/about/kzsm.jpg?url';
	let portraitLoaded = $state(false);
</script>

<svelte:head>
	<title>かざぐるまについて | かざぐるま</title>
	<meta name="description" content="かざぐるまとは、風下が所属するサークルで、4人のメンバーがイラスト・映像・音楽などを持ち寄り、作品をつくっています。" />
</svelte:head>

<header class="intro">
	<h1>かざぐるまについて</h1>
	<p>かざぐるまとは、風下が所属するサークルで、4人のメンバーがイラスト・映像・音楽などを持ち寄り、作品をつくっています。</p>
</header>

<section class="character">
	<div class="character-info">
		<h2>風下 <small>kazashimo</small></h2>
	</div>
	<div class="portrait-frame">
		<img class="character-portrait" class:loaded={portraitLoaded} src={portrait} alt="片手を上げる風下" use:trackImageLoad={() => (portraitLoaded = true)} />
		<span class="tape corner-tl" aria-hidden="true"></span>
		<span class="tape corner-tr" aria-hidden="true"></span>
		<span class="tape corner-bl" aria-hidden="true"></span>
		<span class="tape corner-br" aria-hidden="true"></span>
		<ul class="character-links">
			<li class="tilt-1"><a href="https://www.youtube.com/@Kazashimo_Ch" target="_blank" rel="noopener noreferrer">YouTube <span>@Kazashimo_Ch</span></a></li>
			<li class="tilt-2"><a href="https://x.com/haru01234567890" target="_blank" rel="noopener noreferrer">X <span>@haru01234567890</span></a></li>
			<li class="tilt-3"><a href="https://www.tiktok.com/@kazashimo9346" target="_blank" rel="noopener noreferrer">TikTok <span>@kazashimo9346</span></a></li>
			<li class="tilt-4"><a href="https://www.amazon.co.jp/hz/wishlist/ls/2PZZB1ZGEC13D?ref_=wl_share" target="_blank" rel="noopener noreferrer">Amazon <span>ほしい物リスト</span></a></li>
		</ul>
	</div>
</section>

<section class="members-section">
	<h2>MEMBERS</h2>
	<ul class="members">
		<li class="tilt-1"><span class="tape" aria-hidden="true"></span><div class="note-body"><strong>はる</strong><span class="roles">犬・監督・演出・アート</span></div></li>
		<li class="tilt-2"><span class="tape" aria-hidden="true"></span><div class="note-body"><strong>ふぉるね</strong><span class="roles">企画・撮影・編集・開発</span></div></li>
		<li class="tilt-3"><span class="tape" aria-hidden="true"></span><div class="note-body"><strong>ウィンダル</strong><span class="roles">企画・演出・撮影・編集</span></div></li>
		<li class="tilt-4 me">
			<span class="tape" aria-hidden="true"></span>
			<div class="note-body"><strong>なっつ</strong><span class="roles">開発・サウンド・編集・企画</span></div>
		</li>
	</ul>
</section>

<section class="contact">
	<h2>CONTACT</h2>
	<p>お問い合わせフォームは現在準備中です。</p>
</section>

<style>
	.intro { max-width: 820px; margin-bottom: clamp(2rem, 5vw, 4rem); }
	.intro h1 { margin: 0; font-size: clamp(2rem, 6vw, 3.5rem); }
	.intro p { margin: .9rem 0 0; color: var(--muted); font-size: 1rem; line-height: 1.7; }
	.character { display: block; }
	.character-info { min-width: 0; margin-bottom: 1.25rem; }
	.portrait-frame { position: relative; width: 100%; }
	.character-portrait { display: block; width: 100%; aspect-ratio: 4 / 3; border: 1px solid #0000001a; object-fit: cover; object-position: center 25%; background: #fffdf6; box-shadow: 3px 6px 14px #28304a3d; opacity: 0; transform: scale(1.04); transition: opacity .45s ease, transform .45s ease; }
	.character-portrait.loaded { opacity: 1; transform: scale(1); }
	.tape { position: absolute; width: 2.8rem; height: 1.15rem; background: #fff9dbb3; box-shadow: 0 1px 2px #0f172a26; }
	.corner-tl { top: -.45rem; left: -.5rem; transform: rotate(-42deg); }
	.corner-tr { top: -.45rem; right: -.5rem; transform: rotate(42deg); }
	.corner-bl { bottom: -.45rem; left: -.5rem; transform: rotate(42deg); }
	.corner-br { bottom: -.45rem; right: -.5rem; transform: rotate(-42deg); }
	.character h2 { margin: 0; font-size: clamp(2rem, 5vw, 3.3rem); }
	.character h2 small { display: block; color: var(--muted); font-size: .8rem; font-weight: 500; letter-spacing: .14em; }
	/* SNSリンクは写真の上に直接貼り付けられた付箋として表示する。
	   写真の下端に沿って並べ、幅が足りない画面では自然に折り返す。 */
	.character-links { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; display: flex; flex-wrap: wrap; gap: .55rem; margin: 0; padding: 1rem; list-style: none; }
	.character li { --link-color: #5a65b1; }
	.character li:nth-child(2) { --link-color: #a66fe4; }
	.character li:nth-child(3) { --link-color: #d0a900; }
	.character li:nth-child(4) { --link-color: #858994; }
	.character li.tilt-1 { --tilt: -0.9deg; }
	.character li.tilt-2 { --tilt: 0.7deg; }
	.character li.tilt-3 { --tilt: -0.6deg; }
	.character li.tilt-4 { --tilt: 0.8deg; }
	.character a {
		display: inline-grid; grid-template-columns: auto auto auto; align-items: center; gap: .5rem; padding: .4rem .65rem;
		border: 1px solid #4e5a80; border-left: 5px solid var(--link-color); color: #303b78; background: rgba(255,253,247,.94);
		box-shadow: 3px 3px 0 color-mix(in srgb, var(--link-color) 28%, transparent);
		font-family: Verdana, 'Yu Gothic', sans-serif; font-size: .78rem; font-weight: 700; text-decoration: underline; text-decoration-style: dotted;
		transform: rotate(var(--tilt)); transition: box-shadow .12s ease, transform .12s ease;
		animation: note-settle .5s cubic-bezier(.34, 1.56, .64, 1) both;
	}
	.character li.tilt-1 a { animation-delay: .05s; }
	.character li.tilt-2 a { animation-delay: .15s; }
	.character li.tilt-3 a { animation-delay: .25s; }
	.character li.tilt-4 a { animation-delay: .35s; }
	@keyframes note-settle {
		from { opacity: 0; transform: translateY(8px) rotate(calc(var(--tilt) * 5)) scale(.8); }
		to { opacity: 1; transform: translateY(0) rotate(var(--tilt)) scale(1); }
	}
	.character a::after { color: var(--link-color); content: '↗'; font: 700 .8rem monospace; text-decoration: none; }
	.character a:hover { box-shadow: 5px 5px 0 color-mix(in srgb, var(--link-color) 36%, transparent); transform: rotate(var(--tilt)) translate(-1px,-1px); }
	.character a:focus-visible { outline: 2px dashed var(--link-color); outline-offset: 3px; }
	.character a span { color: #596483; font: .68rem monospace; text-decoration: none; }
	.members-section, .contact { margin-top: 1rem; padding: 1rem; border: 1px solid #4e5a80; background: rgba(255,255,255,.92); box-shadow: 5px 5px 0 rgba(90,101,177,.2); }
	.members-section h2, .contact h2 { margin: 0 0 .8rem; padding-bottom: .4rem; border-bottom: 2px dotted #7d87a2; color: #303b78; font: 800 .92rem monospace; letter-spacing: .08em; }
	.members { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.1rem 1.4rem; margin: 1.1rem 0 0; padding: 0; list-style: none; }
	/* liはテープ+付箋を重ねるための位置合わせ役に徹し、clip-pathは持たない
	   (テープをliの外にはみ出させて描くため。clip-pathをliに掛けると
	   はみ出した子要素ごと切り取られ、テープが表示されなくなる)。 */
	.members li { position: relative; }
	.members .note-body {
		display: grid; gap: .3rem; padding: 1.15rem 1.2rem 1.05rem; background: #fffdf6; box-shadow: 2px 3px 0 #a89873, 4px 7px 10px #28304a30;
		clip-path: polygon(
			0% 1%, 12% 0%, 25% 1.5%, 38% 0.5%, 50% 1.5%, 62% 0%, 75% 1.5%, 88% 0.5%, 100% 1%,
			99% 15%, 100% 30%, 99% 50%, 100% 70%, 99% 85%, 100% 99%,
			88% 100%, 75% 98.5%, 62% 100%, 50% 98.5%, 38% 100%, 25% 98.5%, 12% 100%, 0% 99%,
			1% 85%, 0% 70%, 1% 50%, 0% 30%, 1% 15%
		);
	}
	.members li.tilt-1 { transform: rotate(-1.6deg); }
	.members li.tilt-2 { transform: rotate(1.3deg); }
	.members li.tilt-3 { transform: rotate(-1deg); }
	.members li.tilt-4 { transform: rotate(1.6deg); }
	.members .tape { position: absolute; z-index: 1; top: -.4rem; left: 50%; width: 2.4rem; height: 1rem; background: #fff9dbb3; box-shadow: 0 1px 2px #0f172a26; transform: translateX(-50%) rotate(-2deg); }
	.members .roles, .contact p:last-child { color: var(--muted); font-size: .82rem; }
	/* モノスペース指定は名前だけに留める。liごと適用すると.rolesの日本語も
	   このフォントスタックへフォールバックし、他メンバーと書体が変わって
	   見た目の太さが違って見えてしまう。 */
	.members li.me strong { font-family: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace; }
	@media (max-width: 680px) {
		.character h2 { font-size: clamp(1.8rem, 10vw, 2.5rem); }
		.character-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); justify-items: start; padding: .65rem; gap: .4rem; }
		.character a { max-width: 100%; padding: .3rem .5rem; font-size: .66rem; }
		.character a span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
		.members { grid-template-columns: 1fr; }
	}
	@media (prefers-reduced-motion: reduce) { .character a { transition: none; animation: none; } .character-portrait { transition: none; opacity: 1; transform: none; } }
</style>
