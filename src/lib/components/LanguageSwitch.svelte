<script lang="ts">
	import type { Lang } from '$lib/types/content';
	import { langs } from '$lib/i18n';

	let { lang, hrefFor }: { lang: Lang; hrefFor: (lang: Lang) => string } = $props();
	const labels: Record<Lang, string> = { ja: 'JP', en: 'EN', 'zh-TW': '繁中', ko: '한국어' };
</script>

<div class="lang-switch" role="group" aria-label="Language / 言語">
	{#each langs as target}
		{#if lang === target}
			<span class="chip chip-{target} active" aria-current="true">{labels[target]}</span>
		{:else}
			<a class="chip chip-{target}" href={hrefFor(target)} hreflang={target} rel="alternate">{labels[target]}</a>
		{/if}
	{/each}
</div>

<style>
	.lang-switch { display: inline-flex; flex: none; gap: .2rem; }
	.chip { display: inline-flex; align-items: center; justify-content: center; height: 1.5rem; padding: 0 .4rem; border-radius: 999px; font-size: .62rem; font-weight: 800; letter-spacing: .02em; text-decoration: none; line-height: 1; white-space: nowrap; opacity: .55; transition: opacity .12s ease, box-shadow .12s ease; }
	.chip-en { color: #2f5fa8; background: #dbe8fb; }
	.chip-ja { color: #a83b3b; background: #fbdcdc; }
	.chip-zh-TW { color: #276a62; background: #d9f1ed; }
	.chip-ko { color: #71509b; background: #eee3fa; }
	.chip.active { opacity: 1; box-shadow: inset 0 0 0 1px currentColor; cursor: default; }
	a.chip:hover, a.chip:focus-visible { opacity: .85; }
</style>
