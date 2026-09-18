<script lang="ts">
	import type { Lang } from '$lib/types/content';

	let { lang, href, label }: { lang: Lang; href: string; label: string } = $props();
</script>

<a class="lang-switch" {href} hreflang={lang === 'en' ? 'ja' : 'en'} rel="alternate">{label}</a>

<style>
	.lang-switch { display: inline-flex; align-items: center; flex: none; height: 2.1rem; padding: 0 .7rem; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); font-size: .74rem; font-weight: 700; text-decoration: none; white-space: nowrap; }
	.lang-switch:hover, .lang-switch:focus-visible { border-color: var(--accent); color: var(--accent-strong); }
</style>
