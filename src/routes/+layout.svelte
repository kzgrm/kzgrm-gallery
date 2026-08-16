<script lang="ts">
	import '@fontsource/zen-maru-gothic/500.css';
	import '@fontsource/zen-maru-gothic/700.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const links = [
		{ href: '/', label: 'ホーム', section: 'home' },
		{ href: '/about/', label: '私たちについて', section: 'about' },
		{ href: '/activities/', label: '活動', section: 'activities' },
		{ href: '/gallery/', label: '写真', section: 'gallery' }
	];

	const path = (value: string) => `${base}${value}`;
	const currentSection = $derived(page.url.pathname.replace(base, '').split('/')[1] || 'home');
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={path('/favicon.svg')} />
	<link rel="preload" href={path('/header.webp')} as="image" type="image/webp" />
	<meta property="og:site_name" content="かざぐるま" />
</svelte:head>

<header class="site-header">
	<a class="brand" href={path('/')} aria-label="かざぐるま ホーム">
		<img class="brand-icon" src={path('/favicon.svg')} alt="" width="44" height="44" />
		<img class="brand-logo" src={path('/header.webp')} alt="かざぐるま" width="201" height="40" />
		<span>gallery</span>
	</a>
	<nav aria-label="メインナビゲーション">
		{#each links as link, index}
			<a
				href={path(link.href)}
				class:active={currentSection === link.section}
				style={`--section-color: var(--blade-${index + 1})`}
				aria-current={currentSection === link.section ? 'page' : undefined}
			>
				{link.label}
			</a>
		{/each}
	</nav>
</header>

<main>{@render children()}</main>

<footer>
	<small>{new Date().getFullYear()} kazaguruma · gallery</small>
</footer>

<style>
	:global(:root) {
		color-scheme: light;
		--bg: #f8fafc;
		--card: #fff;
		--text: #0f172a;
		--muted: #475569;
		--faint: #8793a5;
		--border: #dbe1ea;
		--border-strong: #b7bfd0;
		--accent: #5a65b1;
		--accent-strong: #454e8f;
		--accent-soft: #eef0fa;
		--blade-1: #a66fe4;
		--blade-2: #5a65b1;
		--blade-3: #e7bd16;
		--blade-4: #a8adb7;
		--font-display: 'Zen Maru Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		--radius: 12px;
		--radius-lg: 16px;
		--shadow-sm: 0 1px 2px rgba(15, 23, 42, .05), 0 1px 3px rgba(15, 23, 42, .04);
		--shadow-md: 0 12px 30px rgba(15, 23, 42, .08);
	}
	:global(*) { box-sizing: border-box; }
	:global(html) { min-width: 320px; min-height: 100%; scrollbar-gutter: stable; }
	:global(body) { min-height: 100vh; margin: 0; color: var(--text); background: var(--bg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; }
	:global(body) { display: flex; flex-direction: column; }
	:global(body > div) { display: flex !important; min-height: 100vh; flex-direction: column; }
	:global(h1), :global(h2), :global(h3) { font-family: var(--font-display); text-wrap: balance; }
	:global(a) { text-underline-offset: .16em; }
	:global(button), :global(input) { font: inherit; }
	.site-header { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem max(1rem, calc((100vw - 1180px) / 2)); border-bottom: 1px solid var(--border); background: rgba(255, 255, 255, .94); backdrop-filter: blur(14px); }
	.brand { display: flex; align-items: center; gap: .55rem; min-width: 0; color: var(--text); text-decoration: none; }
	.brand-icon { width: 44px; height: 44px; flex: none; animation: settle 1.45s cubic-bezier(.28, .9, .32, 1); }
	.brand-logo { display: block; width: auto; height: 40px; }
	.brand span { padding-left: .65rem; border-left: 1px solid var(--border); color: var(--muted); font-family: var(--font-display); font-size: .9rem; letter-spacing: .08em; }
	nav { display: flex; gap: 1.1rem; }
	nav a { position: relative; padding: .35rem 0; color: var(--muted); font-size: .9rem; text-decoration: none; }
	nav a::after { position: absolute; right: 0; bottom: 0; left: 0; height: 2px; border-radius: 999px; background: var(--section-color); content: ''; transform: scaleX(0); transition: transform .16s ease; }
	nav a:hover::after, nav a.active::after { transform: scaleX(1); }
	nav a:hover, nav a.active { color: var(--text); font-weight: 700; }
	main { width: min(100% - 2rem, 1120px); flex: 1; margin: 0 auto; padding: clamp(2rem, 5vw, 4.5rem) 0; }
	footer { padding: 1rem; border-top: 1px solid var(--border); color: var(--faint); text-align: center; }
	footer small { font-size: .74rem; letter-spacing: .04em; }
	:global(.eyebrow) { margin: 0 0 .55rem; color: var(--accent); font-size: .7rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
	:global(.page-heading) { max-width: 720px; margin-bottom: 2rem; }
	:global(.page-heading h1) { margin: 0; font-size: clamp(2rem, 6vw, 3.4rem); line-height: 1.2; }
	:global(.page-heading p:last-child) { margin: .65rem 0 0; color: var(--muted); }
	:global(.prose) { max-width: 760px; }
	:global(.prose img), :global(.prose video) { display: block; max-width: 100%; height: auto; margin: 1.5rem auto; border-radius: var(--radius); }
	:global(.prose a) { color: var(--accent-strong); }
	:global(.prose hr) { margin: 2rem 0; border: 0; border-top: 1px solid var(--border); }
	@keyframes settle { from { transform: rotate(720deg); } to { transform: rotate(0); } }
	@media (max-width: 760px) {
		.site-header { align-items: flex-start; flex-direction: column; padding: .75rem 1rem; }
		.brand-icon { width: 36px; height: 36px; }
		.brand-logo { height: 32px; }
		.brand span { font-size: .78rem; }
		nav { width: 100%; gap: .25rem; justify-content: space-between; }
		nav a { padding: .35rem .15rem; font-size: .78rem; }
		main { width: min(100% - 1.25rem, 1120px); padding-top: 2rem; }
	}
	@media (prefers-reduced-motion: reduce) {
		.brand-icon { animation: none; }
		nav a::after { transition: none; }
	}
</style>
