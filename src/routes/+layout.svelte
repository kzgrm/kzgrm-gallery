<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import '@fontsource/zen-maru-gothic/700.css';
	import AnnouncementRail from '$lib/components/AnnouncementRail.svelte';
	import { homepagePreviewState } from '$lib/preview-state.svelte';
	import type { ContentSummary } from '$lib/types/content';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { railNews: ContentSummary[] }; children: Snippet } = $props();
	let navigating = $state(false);
	let menuOpen = $state(false);
	let menuShell: HTMLElement;
	const path = (value: string) => `${base}${value}`;
	const currentSection = $derived(page.url.pathname.replace(base, '').split('/')[1] || 'home');
	const displayedRailNews = $derived(currentSection === 'preview' && homepagePreviewState.railItem?.kind === 'news' && homepagePreviewState.railItem.rail
		? [homepagePreviewState.railItem, ...data.railNews.filter((item) => item.slug !== homepagePreviewState.railItem?.slug)].slice(0, 3)
		: data.railNews);
	let searchQuery = $state('');

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		const value = searchQuery.trim();
		if (!value) return;
		goto(`${path('/works/')}?q=${encodeURIComponent(value)}`);
	}

	beforeNavigate(() => {
		navigating = true;
		menuOpen = false;
	});
	afterNavigate(() => {
		navigating = false;
	});

	onMount(() => {
		const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) navigating = false; };
		window.addEventListener('pageshow', onPageShow);
		return () => window.removeEventListener('pageshow', onPageShow);
	});

	function closeMenuOnEscape(event: KeyboardEvent) {
		if (event.key === 'Escape') menuOpen = false;
	}

	function closeMenuFromOutside(event: MouseEvent) {
		if (menuOpen && !menuShell?.contains(event.target as Node)) menuOpen = false;
	}

	// Compassと同じ、4本バーから専用Xへ変形する単一進捗値ベースのアニメーション。
	const T_S1_END = 320;
	const T_VANISH_OUTER = 240;
	const T_VANISH_INNER = 220;
	const T_OUTER_VANISH_END = T_S1_END + T_VANISH_OUTER;
	const T_INNER_VANISH_END = T_OUTER_VANISH_END + T_VANISH_INNER;
	const T_ENTRY_GAP = 30;
	const T_ENTRY_STEP = 90;
	const T_ENTRY_START = T_INNER_VANISH_END + T_ENTRY_GAP;
	const T_CROSS = 60;
	const TOTAL_MS = T_ENTRY_START + T_ENTRY_STEP * 4 + T_CROSS;
	function ms(t: number) { return t / TOTAL_MS; }
	const S1_END = ms(T_S1_END);
	const OUTER_VANISH_END = ms(T_OUTER_VANISH_END);
	const INNER_VANISH_END = ms(T_INNER_VANISH_END);
	const CROSS_START = ms(TOTAL_MS - T_CROSS);
	function clamp01(x: number) { return x < 0 ? 0 : x > 1 ? 1 : x; }
	function stageT(p: number, a: number, b: number) { return clamp01((p - a) / (b - a)); }
	function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

	const brandPalette = ['#5A65B1', '#FFDA52', '#D2D1D6', '#A66FE4'];
	const brandOutline = '#212121';
	const BAR_HALF_LEN = 7;
	const BAR_FILL_W = 1.8;
	const BAR_OUTLINE_W = 4;
	const STUB_HALF = 1.2;
	const STUB_FILL_W = 2.4;
	const STUB_OUTLINE_W = 4.6;
	const VANISH_TRAVEL = 20;

	type MenuBar = {
		closedY: number;
		color: string;
		vanishSign: 1 | -1;
		vanishStart: number;
		vanishEnd: number;
		targetAngle: number;
		entryStart: number;
		entryEnd: number;
		landed: [number, number];
		diagStart: [number, number];
	};

	const menuBars: MenuBar[] = [
		{ closedY: -6, color: brandPalette[0], vanishSign: 1, vanishStart: S1_END, vanishEnd: OUTER_VANISH_END, targetAngle: 45, entryStart: ms(T_ENTRY_START + T_ENTRY_STEP * 2), entryEnd: ms(T_ENTRY_START + T_ENTRY_STEP * 3), landed: [4, 4], diagStart: [11, 11] },
		{ closedY: -2, color: brandPalette[1], vanishSign: 1, vanishStart: OUTER_VANISH_END, vanishEnd: INNER_VANISH_END, targetAngle: -45, entryStart: ms(T_ENTRY_START + T_ENTRY_STEP * 3), entryEnd: ms(T_ENTRY_START + T_ENTRY_STEP * 4), landed: [-4, 4], diagStart: [-11, 11] },
		{ closedY: 2, color: brandPalette[2], vanishSign: -1, vanishStart: OUTER_VANISH_END, vanishEnd: INNER_VANISH_END, targetAngle: -45, entryStart: ms(T_ENTRY_START + T_ENTRY_STEP), entryEnd: ms(T_ENTRY_START + T_ENTRY_STEP * 2), landed: [4, -4], diagStart: [11, -11] },
		{ closedY: 6, color: brandPalette[3], vanishSign: -1, vanishStart: S1_END, vanishEnd: OUTER_VANISH_END, targetAngle: 45, entryStart: ms(T_ENTRY_START), entryEnd: ms(T_ENTRY_START + T_ENTRY_STEP), landed: [-4, -4], diagStart: [-11, -11] }
	];

	const xStubs = menuBars.map((bar) => ({
		dx: bar.landed[0],
		dy: bar.landed[1],
		rotate: bar.targetAngle,
		color: bar.color
	}));

	function barState(p: number, bar: MenuBar): { transform: string; opacity: number; halfLen: number; fillW: number; outlineW: number } {
		let rotation: number;
		let tx: number;
		let ty: number;
		let opacity: number;

		if (p <= S1_END) {
			const theta = lerp(0, 90, stageT(p, 0, S1_END));
			const rad = (theta * Math.PI) / 180;
			rotation = theta;
			tx = -bar.closedY * Math.sin(rad);
			ty = bar.closedY * Math.cos(rad);
			return { transform: `translate(${tx} ${ty}) rotate(${rotation} 0 0)`, opacity: 1, halfLen: BAR_HALF_LEN, fillW: BAR_FILL_W, outlineW: BAR_OUTLINE_W };
		}

		if (p <= bar.vanishEnd) {
			rotation = 90;
			tx = -bar.closedY;
			const vanishT = stageT(p, bar.vanishStart, bar.vanishEnd);
			ty = lerp(0, VANISH_TRAVEL * bar.vanishSign, vanishT);
			opacity = 1 - vanishT;
			return { transform: `translate(${tx} ${ty}) rotate(${rotation} 0 0)`, opacity, halfLen: BAR_HALF_LEN, fillW: BAR_FILL_W, outlineW: BAR_OUTLINE_W };
		}

		if (p <= bar.entryStart) {
			rotation = bar.targetAngle;
			[tx, ty] = bar.diagStart;
			opacity = 0;
		} else if (p <= bar.entryEnd) {
			rotation = bar.targetAngle;
			const t = stageT(p, bar.entryStart, bar.entryEnd);
			tx = lerp(bar.diagStart[0], bar.landed[0], t);
			ty = lerp(bar.diagStart[1], bar.landed[1], t);
			opacity = t;
		} else {
			rotation = bar.targetAngle;
			[tx, ty] = bar.landed;
			opacity = 1 - stageT(p, CROSS_START, 1);
		}

		return { transform: `translate(${tx} ${ty}) rotate(${rotation} 0 0)`, opacity, halfLen: STUB_HALF, fillW: STUB_FILL_W, outlineW: STUB_OUTLINE_W };
	}

	let reducedMotion = $state(false);
	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
	const menuIconOpen = tweened(0, { duration: TOTAL_MS, easing: cubicInOut });
	$effect(() => {
		menuIconOpen.set(menuOpen ? 1 : 0, { duration: reducedMotion ? 0 : TOTAL_MS });
	});
	let barStates = $derived(menuBars.map((bar) => barState($menuIconOpen, bar)));
	let xShapeOpacity = $derived(stageT($menuIconOpen, CROSS_START, 1));
</script>

<svelte:window onkeydown={closeMenuOnEscape} onclick={closeMenuFromOutside} />

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={path('/favicon.svg')} />
	<link rel="apple-touch-icon" href={path('/apple-touch-icon.png')} />
	<link rel="preload" href={path('/header.webp')} as="image" type="image/webp" />
	<meta name="theme-color" content="#ffffff" />
	<meta name="apple-mobile-web-app-title" content="かざぐるま" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta property="og:site_name" content="かざぐるま" />
</svelte:head>

{#snippet searchIcon()}
	<svg class="search-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" /><line x1="21" y1="21" x2="16.65" y2="16.65" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
{/snippet}

{#snippet menuIconHome()}
	<svg viewBox="0 0 100 100" class="menu-icon-svg" aria-hidden="true"><g transform="translate(0 0) rotate(0 50 50)"><path stroke-width="9" stroke-linejoin="round" d="M50,50 L50,24 A26,26 0 0 1 76,50 Z" fill="#212121" stroke="#212121"></path><path d="M50,50 L50,24 A26,26 0 0 1 76,50 Z" fill="#5A65B1"></path></g><g transform="translate(0 0) rotate(90 50 50)"><path stroke-width="9" stroke-linejoin="round" d="M50,50 L50,24 A26,26 0 0 1 76,50 Z" fill="#212121" stroke="#212121"></path><path d="M50,50 L50,24 A26,26 0 0 1 76,50 Z" fill="#FFDA52"></path></g><g transform="translate(0 0) rotate(180 50 50)"><path stroke-width="9" stroke-linejoin="round" d="M50,50 L50,24 A26,26 0 0 1 76,50 Z" fill="#212121" stroke="#212121"></path><path d="M50,50 L50,24 A26,26 0 0 1 76,50 Z" fill="#D2D1D6"></path></g><g transform="translate(0 0) rotate(270 50 50)"><path stroke-width="9" stroke-linejoin="round" d="M50,50 L50,24 A26,26 0 0 1 76,50 Z" fill="#212121" stroke="#212121"></path><path d="M50,50 L50,24 A26,26 0 0 1 76,50 Z" fill="#A66FE4"></path></g></svg>
{/snippet}

{#snippet menuIconAbout()}
	<svg viewBox="0 0 100 100" class="menu-icon-svg" aria-hidden="true"><g transform="translate(0 -20) rotate(90 50 50)"><line stroke-linecap="round" x1="45" y1="50" x2="55" y2="50" stroke="#212121" stroke-width="19"></line><line stroke-linecap="round" x1="45" y1="50" x2="55" y2="50" stroke="#5A65B1" stroke-width="10"></line></g><g transform="translate(20 0) rotate(0 50 50)"><line stroke-linecap="round" x1="45" y1="50" x2="55" y2="50" stroke="#212121" stroke-width="19"></line><line stroke-linecap="round" x1="45" y1="50" x2="55" y2="50" stroke="#FFDA52" stroke-width="10"></line></g><g transform="translate(0 20) rotate(90 50 50)"><line stroke-linecap="round" x1="45" y1="50" x2="55" y2="50" stroke="#212121" stroke-width="19"></line><line stroke-linecap="round" x1="45" y1="50" x2="55" y2="50" stroke="#D2D1D6" stroke-width="10"></line></g><g transform="translate(-20 0) rotate(0 50 50)"><line stroke-linecap="round" x1="45" y1="50" x2="55" y2="50" stroke="#212121" stroke-width="19"></line><line stroke-linecap="round" x1="45" y1="50" x2="55" y2="50" stroke="#A66FE4" stroke-width="10"></line></g></svg>
{/snippet}

{#snippet menuIconActivities()}
	<svg viewBox="0 0 100 100" class="menu-icon-svg" aria-hidden="true"><defs><clipPath id="clip-n-menu-activities"><rect x="0" y="0" width="100" height="50"></rect></clipPath><clipPath id="clip-s-menu-activities"><rect x="0" y="50" width="100" height="50"></rect></clipPath></defs><g transform="translate(0 -6) rotate(90 50 50)" clip-path="url(#clip-s-menu-activities)"><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#212121" stroke-width="15"></line><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#5A65B1" stroke-width="6"></line></g><g transform="translate(6 0) rotate(0 50 50)" clip-path="url(#clip-n-menu-activities)"><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#212121" stroke-width="15"></line><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#FFDA52" stroke-width="6"></line></g><g transform="translate(0 6) rotate(90 50 50)" clip-path="url(#clip-n-menu-activities)"><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#212121" stroke-width="15"></line><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#D2D1D6" stroke-width="6"></line></g><g transform="translate(-6 0) rotate(0 50 50)" clip-path="url(#clip-s-menu-activities)"><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#212121" stroke-width="15"></line><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#A66FE4" stroke-width="6"></line></g><g transform="translate(0 -6) rotate(90 50 50)" clip-path="url(#clip-n-menu-activities)"><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#212121" stroke-width="15"></line><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#5A65B1" stroke-width="6"></line></g><g transform="translate(6 0) rotate(0 50 50)" clip-path="url(#clip-s-menu-activities)"><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#212121" stroke-width="15"></line><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#FFDA52" stroke-width="6"></line></g><g transform="translate(0 6) rotate(90 50 50)" clip-path="url(#clip-s-menu-activities)"><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#212121" stroke-width="15"></line><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#D2D1D6" stroke-width="6"></line></g><g transform="translate(-6 0) rotate(0 50 50)" clip-path="url(#clip-n-menu-activities)"><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#212121" stroke-width="15"></line><line stroke-linecap="round" x1="50" y1="25" x2="50" y2="75" stroke="#A66FE4" stroke-width="6"></line></g></svg>
{/snippet}

{#snippet menuIconGallery()}
	<svg viewBox="0 0 100 100" class="menu-icon-svg" aria-hidden="true"><g transform="translate(-15 -15) rotate(0 50 50)"><rect x="34.5" y="34.5" width="31" height="31" fill="#212121"></rect><rect x="39" y="39" width="22" height="22" fill="#5A65B1"></rect></g><g transform="translate(15 -15) rotate(0 50 50)"><rect x="34.5" y="34.5" width="31" height="31" fill="#212121"></rect><rect x="39" y="39" width="22" height="22" fill="#FFDA52"></rect></g><g transform="translate(-15 15) rotate(0 50 50)"><rect x="34.5" y="34.5" width="31" height="31" fill="#212121"></rect><rect x="39" y="39" width="22" height="22" fill="#D2D1D6"></rect></g><g transform="translate(15 15) rotate(0 50 50)"><rect x="34.5" y="34.5" width="31" height="31" fill="#212121"></rect><rect x="39" y="39" width="22" height="22" fill="#A66FE4"></rect></g></svg>
{/snippet}

{#snippet menuIconNews()}
	<svg viewBox="0 0 100 100" class="menu-icon-svg" aria-hidden="true">
		<line x1="24" y1="28" x2="76" y2="28" stroke="#212121" stroke-width="13" stroke-linecap="round" /><line x1="24" y1="28" x2="76" y2="28" stroke="#5A65B1" stroke-width="5" stroke-linecap="round" />
		<line x1="24" y1="44" x2="66" y2="44" stroke="#212121" stroke-width="13" stroke-linecap="round" /><line x1="24" y1="44" x2="66" y2="44" stroke="#FFDA52" stroke-width="5" stroke-linecap="round" />
		<line x1="24" y1="60" x2="72" y2="60" stroke="#212121" stroke-width="13" stroke-linecap="round" /><line x1="24" y1="60" x2="72" y2="60" stroke="#D2D1D6" stroke-width="5" stroke-linecap="round" />
		<line x1="24" y1="76" x2="58" y2="76" stroke="#212121" stroke-width="13" stroke-linecap="round" /><line x1="24" y1="76" x2="58" y2="76" stroke="#A66FE4" stroke-width="5" stroke-linecap="round" />
	</svg>
{/snippet}

<div class:visible={navigating} class="page-progress" aria-hidden="true"><span></span></div>

<header class="site-header">
	<a class="site-title" href={path('/')} aria-label="かざぐるま ホーム">
		<img class:spinning={navigating} class="site-icon" src={path('/favicon.svg')} alt="" width="44" height="44" />
		<img class="site-logo" src={path('/header.webp')} alt="かざぐるま" width="201" height="40" />
	</a>
	<div class="header-actions">
		<form class="header-search desktop-only-search" onsubmit={submitSearch}>
			{@render searchIcon()}
			<input bind:value={searchQuery} type="search" placeholder="作品を検索" aria-label="作品を検索" />
		</form>
		<nav class="desktop-nav" aria-label="メインナビゲーション">
			<a class="nav-works" data-en="works" class:active={currentSection === 'works'} aria-current={currentSection === 'works' ? 'page' : undefined} href={path('/works/')}>作品</a>
			<a class="nav-records" data-en="records" class:active={currentSection === 'records'} aria-current={currentSection === 'records' ? 'page' : undefined} href={path('/records/')}>記録</a>
			<a class="nav-about" data-en="about" class:active={currentSection === 'about'} aria-current={currentSection === 'about' ? 'page' : undefined} href={path('/about/')}>かざぐるまについて</a>
		</nav>
		<div class="menu-shell" bind:this={menuShell}>
			<button class="menu-button" type="button" aria-label="すべての機能を開く" aria-expanded={menuOpen} aria-controls="site-menu" onclick={() => menuOpen = !menuOpen}>
				<svg class="menu-icon" viewBox="-12 -12 24 24" aria-hidden="true" focusable="false">
					{#each menuBars as bar, i}
						<g transform={barStates[i].transform} opacity={barStates[i].opacity}>
							<line x1={-barStates[i].halfLen} y1="0" x2={barStates[i].halfLen} y2="0" stroke={brandOutline} stroke-width={barStates[i].outlineW} stroke-linecap="round" />
							<line x1={-barStates[i].halfLen} y1="0" x2={barStates[i].halfLen} y2="0" stroke={bar.color} stroke-width={barStates[i].fillW} stroke-linecap="round" />
						</g>
					{/each}
					<g class="x-shape-group" opacity={xShapeOpacity}>
						{#each xStubs as stub}
							<g transform={`translate(${stub.dx} ${stub.dy}) rotate(${stub.rotate} 0 0)`}>
								<line x1={-STUB_HALF} y1="0" x2={STUB_HALF} y2="0" stroke={brandOutline} stroke-width={STUB_OUTLINE_W} stroke-linecap="round" />
								<line x1={-STUB_HALF} y1="0" x2={STUB_HALF} y2="0" stroke={stub.color} stroke-width={STUB_FILL_W} stroke-linecap="round" />
							</g>
						{/each}
					</g>
				</svg>
			</button>
			{#if menuOpen}
				<nav id="site-menu" class="site-menu" aria-label="すべての機能">
					<form class="header-search menu-search" onsubmit={submitSearch}>
						{@render searchIcon()}
						<input bind:value={searchQuery} type="search" placeholder="作品を検索" aria-label="作品を検索" />
					</form>
					<a class="menu-home" class:active={currentSection === 'home'} aria-current={currentSection === 'home' ? 'page' : undefined} href={path('/')}><span>{@render menuIconHome()}</span><strong>ホーム</strong><small>全体を見渡す</small></a>
					<a class="menu-works" class:active={currentSection === 'works'} aria-current={currentSection === 'works' ? 'page' : undefined} href={path('/works/')}><span>{@render menuIconActivities()}</span><strong>作品</strong><small>作品を一覧する</small></a>
					<a class="menu-records" class:active={currentSection === 'records'} aria-current={currentSection === 'records' ? 'page' : undefined} href={path('/records/')}><span>{@render menuIconGallery()}</span><strong>記録</strong><small>制作や出来事を読む</small></a>
					<a class="menu-news" class:active={currentSection === 'news'} aria-current={currentSection === 'news' ? 'page' : undefined} href={path('/news/')}><span>{@render menuIconNews()}</span><strong>お知らせ</strong><small>過去のお知らせも見る</small></a>
					<a class="menu-about" class:active={currentSection === 'about'} aria-current={currentSection === 'about' ? 'page' : undefined} href={path('/about/')}><span>{@render menuIconAbout()}</span><strong>かざぐるまについて</strong><small>メンバーと風下について</small></a>
				</nav>
			{/if}
		</div>
	</div>
</header>

<AnnouncementRail items={displayedRailNews} newsUrl={path('/news/')} />

<main class:home-page={currentSection === 'home'}>{@render children()}</main>

<footer><small>© {new Date().getFullYear()} KZGRM</small><nav aria-label="外部リンク"><a href="https://www.youtube.com/@Kazashimo_Ch" target="_blank" rel="noopener noreferrer">YouTube</a><a href="https://x.com/haru01234567890" target="_blank" rel="noopener noreferrer">X</a><span>お問い合わせ準備中</span></nav></footer>

<style>
	:global(:root) {
		color-scheme: light;
		--bg: #f8fafc; --card: #fff; --text: #0f172a; --muted: #475569; --faint: #94a3b8; --border: #dbe1ea;
		--border-strong: #b7bfd0; --accent: #5a65b1; --accent-strong: #454e8f; --accent-soft: #eef0fa;
		--blade-1: #a66fe4; --blade-2: #5a65b1; --blade-3: #e7bd16; --blade-4: #a8adb7;
		--font-display: 'Zen Maru Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		--radius: 12px; --radius-lg: 16px;
		--shadow-sm: 0 1px 2px rgba(15,23,42,.05), 0 1px 3px rgba(15,23,42,.04);
		--shadow-md: 0 8px 24px rgba(15,23,42,.06);
		--ring-idle: conic-gradient(from -45deg, #a66fe473, #5a65b173, #ffda5273, #d2d1d673, #a66fe473);
		--ring-focus: conic-gradient(from -45deg, #a66fe4, #5a65b1, #ffda52, #d2d1d6, #a66fe4);
	}
	:global(*) { box-sizing: border-box; }
	:global(html) { min-width: 320px; min-height: 100%; background-color: #fbfaf4; background-image: linear-gradient(#dfe5ec 1px, transparent 1px), linear-gradient(90deg, #dfe5ec 1px, transparent 1px); background-size: 22px 22px; scrollbar-gutter: stable; }
	:global(body) { display: flex; min-height: 100vh; flex-direction: column; margin: 0; color: var(--text); background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; }
	:global(body > div) { display: flex !important; min-height: 100vh; flex-direction: column; }
	:global(h1), :global(h2), :global(h3) { font-family: var(--font-display); }
	:global(h1), :global(h2), :global(h3) { text-wrap: balance; }
	:global(a) { text-underline-offset: .16em; }
	:global(button), :global(input) { font: inherit; }
	.page-progress { position: fixed; z-index: 100; top: 0; right: 0; left: 0; height: 3px; overflow: hidden; pointer-events: none; opacity: 0; transition: opacity .15s; }
	.page-progress.visible { opacity: 1; }
	.page-progress span { display: block; width: 38%; height: 100%; border-radius: 999px; background: linear-gradient(90deg,#a66fe4,#5a65b1,#ffda52,#d2d1d6); animation: progress 1.05s ease-in-out infinite; }
	.site-header { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem max(1.25rem, calc((100vw - 1180px) / 2)); border-bottom: 1px solid var(--border); background: #fff; }
	.site-title { display: flex; align-items: center; gap: .55rem; min-width: 0; color: var(--text); text-decoration: none; }
	.site-icon { width: 44px; height: 44px; flex: none; animation: settle 1.45s cubic-bezier(.28,.9,.32,1); }
	.site-icon.spinning { animation: spin .8s linear infinite; }
	.site-logo { display: block; width: auto; height: 40px; }
	.header-actions { display: flex; align-items: center; gap: 1rem; }
	.desktop-nav { display: flex; gap: 1.15rem; }
	.desktop-nav a { position: relative; padding-bottom: .3rem; color: var(--muted); text-decoration: none; }
	.desktop-nav a::before { position: absolute; top: -.72rem; right: 0; left: 0; color: var(--faint); content: attr(data-en); font: 600 .48rem/1 monospace; letter-spacing: .08em; text-align: center; }
	.desktop-nav a::after { position: absolute; right: 0; bottom: -1px; left: 0; height: 2px; border-radius: 999px; background: currentColor; content: ''; transform: scaleX(0); transition: transform .15s ease; }
	.desktop-nav a:hover::after, .desktop-nav a.active::after { transform: scaleX(1); }
	.desktop-nav a:hover, .desktop-nav a.active { color: var(--text); font-weight: 700; }
	.desktop-nav .nav-works::after { background: #ffda52; }
	.desktop-nav .nav-records::after { background: #d2d1d6; }
	.desktop-nav .nav-about::after { background: #5a65b1; }
	.header-search { position: relative; display: flex; align-items: center; flex: none; }
	.header-search .search-icon { position: absolute; top: 50%; left: .8rem; z-index: 1; color: var(--muted); pointer-events: none; transform: translateY(-50%); }
	.header-search input { width: 100%; padding: .45rem .8rem .45rem 2rem; border: 1.5px solid transparent; border-radius: 999px; color: var(--text); background: linear-gradient(var(--card), var(--card)) padding-box, var(--ring-idle) border-box; font-size: .82rem; transition: background .18s ease; }
	.header-search input:focus { outline: none; background: linear-gradient(var(--card), var(--card)) padding-box, var(--ring-focus) border-box; }
	.header-search input::placeholder { color: var(--faint); }
	.desktop-only-search { width: 10.5rem; }
	.menu-search { width: 100%; margin-bottom: .5rem; }
	.menu-shell { position: relative; display: none; }
	.menu-button { display: grid; width: 48px; height: 48px; place-content: center; padding: 0; border: none; border-radius: 12px; color: var(--text); background: transparent; cursor: pointer; }
	.menu-button:hover { background: #f8fafc; }
	.menu-icon { width: 28px; height: 28px; }
	.site-menu { position: absolute; top: calc(100% + .65rem); right: 0; display: grid; width: min(21rem, calc(100vw - 1.5rem)); padding: .55rem; border: 1px solid var(--border); border-radius: 16px; background: #fff; box-shadow: 0 18px 50px #0f172a24; }
	.site-menu a { display: grid; grid-template-columns: 2rem 1fr; column-gap: .55rem; padding: .65rem .7rem; border-radius: 10px; color: var(--text); text-decoration: none; }
	.site-menu a:hover { background: #f1f5f9; }
	.site-menu a > span { display: grid; grid-row: 1 / 3; align-self: center; justify-items: center; color: var(--accent); font-size: 1.2rem; text-align: center; }
	.menu-icon-svg { width: 1.4rem; height: 1.4rem; }
	.site-menu strong { font-size: .88rem; line-height: 1.35; }
	.site-menu small { color: var(--muted); font-size: .72rem; line-height: 1.35; }
	.site-menu a.active { background: #f8fafc; }
	.site-menu a.active strong { font-weight: 800; }
	.menu-home.active > span { color: #a66fe4; }
	.menu-works.active > span { color: #ffda52; }
	.menu-records.active > span { color: #d2d1d6; }
	.menu-news.active > span { color: #a66fe4; }
	.menu-about.active > span { color: #5a65b1; }
	.menu-home.active, .menu-works.active, .menu-records.active, .menu-news.active, .menu-about.active { position: relative; }
	.menu-home.active::before, .menu-works.active::before, .menu-records.active::before, .menu-news.active::before, .menu-about.active::before { position: absolute; top: .35rem; bottom: .35rem; left: 0; width: 3px; border-radius: 0 999px 999px 0; content: ''; }
	.menu-home.active::before { background: #a66fe4; }
	.menu-works.active::before { background: #ffda52; }
	.menu-records.active::before { background: #d2d1d6; }
	.menu-news.active::before { background: #a66fe4; }
	.menu-about.active::before { background: #5a65b1; }
	main { width: min(100% - 2rem, 1120px); flex: 1; margin: 0 auto; padding: clamp(2rem, 5vw, 4.5rem) 0; }
	main.home-page { padding-top: .75rem; padding-bottom: 1.5rem; }
	footer { display: flex; justify-content: center; flex-wrap: wrap; gap: .5rem 1.25rem; padding: 1rem; border-top: 1px solid var(--border); color: var(--faint); text-align: center; }
	footer small { font-size: .74rem; letter-spacing: .04em; }
	footer nav { display: flex; flex-wrap: wrap; justify-content: center; gap: .4rem .8rem; font-size: .72rem; }
	footer a { color: var(--muted); }
	:global(.eyebrow) { margin: 0 0 .55rem; color: var(--accent); font-size: .7rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
	:global(.prose) { max-width: 760px; }
	:global(.prose img), :global(.prose video) { display: block; max-width: 100%; height: auto; margin: 1.5rem auto; border-radius: var(--radius); }
	:global(.prose a) { color: var(--accent-strong); }
	:global(.prose hr) { margin: 2rem 0; border: 0; border-top: 1px solid var(--border); }
	@keyframes settle { from { transform: rotate(720deg); } to { transform: rotate(0); } }
	@keyframes spin { to { transform: rotate(360deg); } }
	@keyframes progress { from { transform: translateX(-105%); } to { transform: translateX(365%); } }
	@media (prefers-reduced-motion: reduce) { .site-icon, .site-icon.spinning, .page-progress span { animation: none; }.page-progress span { width: 100%; }.desktop-nav a::after { transition: none; } }
	@media (max-width: 720px) {
		.site-header { padding: .7rem .85rem; }
		.site-icon { width: 36px; height: 36px; }
		.site-logo { height: 30px; }
		.desktop-nav { display: none; }
		.desktop-only-search { display: none; }
		.menu-shell { display: block; }
		.menu-button { width: 44px; height: 44px; }
		main { width: min(100% - 1.25rem, 1120px); padding-top: 1rem; padding-bottom: 4rem; }
		main.home-page { padding-top: .35rem; padding-bottom: 1rem; }
	}
</style>
