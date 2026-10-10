<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { page } from '$app/state';
	import ContentArticle from '$lib/components/ContentArticle.svelte';
	import { articleTitle, langPath, t } from '$lib/i18n';
	import type { SiteContent } from '$lib/types/content';
	let { data }: { data: { content: SiteContent } } = $props();
	const lang = $derived(page.data.lang ?? 'ja');
	const strings = $derived(t(lang).news);
</script>

<Seo title={articleTitle(lang, data.content.title)} description={data.content.summary ?? data.content.title} image={data.content.thumbnail} type="article" />
<ContentArticle content={data.content} backUrl={langPath(lang, '/news/')} backLabel={strings.back} eyebrow={strings.eyebrow} />
