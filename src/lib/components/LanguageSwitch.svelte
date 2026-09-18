<script lang="ts">
	import type { Lang } from '$lib/types/content';

	let { lang, href }: { lang: Lang; href: string } = $props();
</script>

<div class="lang-switch" role="group" aria-label="Language / 言語">
	{#if lang === 'en'}
		<span class="chip chip-en active" aria-current="true">EN</span>
		<a class="chip chip-jp" {href} hreflang="ja" rel="alternate">JP</a>
	{:else}
		<a class="chip chip-en" {href} hreflang="en" rel="alternate">EN</a>
		<span class="chip chip-jp active" aria-current="true">JP</span>
	{/if}
</div>

<style>
	.lang-switch { display: inline-flex; flex: none; gap: .25rem; }
	.chip { display: inline-flex; align-items: center; justify-content: center; height: 1.5rem; padding: 0 .5rem; border-radius: 999px; font-size: .62rem; font-weight: 800; letter-spacing: .02em; text-decoration: none; line-height: 1; opacity: .55; transition: opacity .12s ease, box-shadow .12s ease; }
	.chip-en { color: #2f5fa8; background: #dbe8fb; }
	.chip-jp { color: #a83b3b; background: #fbdcdc; }
	.chip.active { opacity: 1; box-shadow: inset 0 0 0 1px currentColor; cursor: default; }
	a.chip:hover, a.chip:focus-visible { opacity: .85; }
</style>
