<script lang="ts">
	import portrait from '../../assets/images/about/kzsm.jpg?url';
</script>

<svelte:head>
	<title>かざぐるまについて | かざぐるま</title>
	<meta name="description" content="サークルKZGRM・かざぐるまについて。" />
</svelte:head>

<header class="intro">
	<h1>かざぐるまについて</h1>
</header>

<section class="character">
	<img class="character-portrait" src={portrait} alt="片手を上げる風下" />
	<div class="character-info">
		<h2>風下 <small>kazashimo</small></h2>
		<ul>
			<li class="tilt-1"><a href="https://www.youtube.com/@Kazashimo_Ch" target="_blank" rel="noopener noreferrer">YouTube <span>@Kazashimo_Ch</span></a></li>
			<li class="tilt-2"><a href="https://x.com/haru01234567890" target="_blank" rel="noopener noreferrer">X <span>@haru01234567890</span></a></li>
			<li class="tilt-3"><a href="https://www.tiktok.com/@kazashimo9346" target="_blank" rel="noopener noreferrer">TikTok <span>@kazashimo9346</span></a></li>
			<li class="tilt-4"><a href="https://www.amazon.co.jp/hz/wishlist/ls/2PZZB1ZGEC13D?ref_=wl_share" target="_blank" rel="noopener noreferrer">Amazon <span>ほしい物リスト</span></a></li>
		</ul>
	</div>
</section>

<section class="members-section">
	<p class="eyebrow">Members</p>
	<h2>メンバー</h2>
	<ul class="members">
		<li><strong>はる</strong><span>犬・監督・演出・アート</span></li>
		<li><strong>ふぉるね</strong><span>企画・撮影・編集・開発</span></li>
		<li><strong>ウィンダル</strong><span>企画・演出・撮影・編集</span></li>
		<li><strong>なっつ</strong><span>開発・サウンド・編集・企画</span></li>
	</ul>
</section>

<section class="contact">
	<p class="eyebrow">Contact</p>
	<h2>お問い合わせ</h2>
	<p>お問い合わせフォームは現在準備中です。</p>
</section>

<style>
	.intro { max-width: 820px; margin-bottom: clamp(2rem, 5vw, 4rem); }
	.intro h1 { margin: 0; font-size: clamp(2rem, 6vw, 3.5rem); }
	.character { position: relative; min-height: 420px; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); box-shadow: var(--shadow-sm); isolation: isolate; }
	.character-portrait { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
	.character::after { position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.9) 43%, rgba(255,255,255,.08) 78%); content: ''; }
	.character-info { width: min(52%, 520px); padding: clamp(1.5rem, 5vw, 3.5rem); }
	.character h2 { margin: 0; font-size: clamp(2rem, 5vw, 3.3rem); }
	.character h2 small { display: block; color: var(--muted); font-size: .8rem; font-weight: 500; letter-spacing: .14em; }
	.character ul { display: grid; gap: .7rem; margin: 2rem 0 0; padding: 0; list-style: none; }
	.character li { --link-color: #5a65b1; }
	.character li:nth-child(2) { --link-color: #a66fe4; }
	.character li:nth-child(3) { --link-color: #d0a900; }
	.character li:nth-child(4) { --link-color: #858994; }
	.character li.tilt-1 { --tilt: -2deg; }
	.character li.tilt-2 { --tilt: 1.5deg; }
	.character li.tilt-3 { --tilt: -1.5deg; }
	.character li.tilt-4 { --tilt: 2deg; }
	.character a { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: .75rem; min-height: 46px; padding: .55rem .7rem; border: 1px solid #4e5a80; border-left: 6px solid var(--link-color); color: #303b78; background: rgba(255,253,247,.94); box-shadow: 3px 3px 0 color-mix(in srgb, var(--link-color) 28%, transparent); font-family: Verdana, 'Yu Gothic', sans-serif; font-size: .86rem; font-weight: 700; text-decoration: underline; text-decoration-style: dotted; transform: rotate(var(--tilt)); transition: box-shadow .12s ease, transform .12s ease; }
	.character a::after { color: var(--link-color); content: '↗'; font: 700 .8rem monospace; text-decoration: none; }
	.character a:hover { box-shadow: 5px 5px 0 color-mix(in srgb, var(--link-color) 36%, transparent); transform: rotate(var(--tilt)) translate(-1px,-1px); }
	.character a:focus-visible { outline: 2px dashed var(--link-color); outline-offset: 3px; }
	.character a span { justify-self: end; color: #596483; font: .72rem monospace; text-decoration: none; }
	.members-section, .contact { margin-top: 1rem; padding: 1.5rem; border: 1px dashed var(--border-strong); border-radius: 4px; }
	.members-section h2, .contact h2 { margin: 0; }
	.members { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin: 1rem 0 0; padding: 0; list-style: none; }
	.members li { display: grid; gap: .25rem; padding: .85rem; border-radius: var(--radius); background: var(--accent-soft); }
	.members span, .contact p:last-child { color: var(--muted); font-size: .82rem; }
	@media (max-width: 680px) {
		.character { min-height: 0; }
		.character-portrait { position: relative; z-index: 0; aspect-ratio: 3 / 2; height: auto; object-position: center; }
		.character::after { display: none; }
		.character-info { width: 100%; padding: 1.25rem; border-top: 1px solid var(--border); background: var(--card); }
		.character h2 { font-size: clamp(1.8rem, 10vw, 2.5rem); }
		.character ul { margin-top: 1.25rem; }
		.character a { grid-template-columns: 1fr auto; }
		.character a span { grid-column: 1; grid-row: 2; justify-self: start; }
		.character a::after { grid-column: 2; grid-row: 1 / 3; }
		.members { grid-template-columns: 1fr; }
	}
	@media (prefers-reduced-motion: reduce) { .character a { transition: none; } }
</style>
