<script lang="ts">
	// What a search result or a shared link shows for one page: its title, its description and
	// its picture. The address (canonical, og:url) is the layout's, since it is the same rule for
	// every page.
	let { title, description, image, type = 'website' }: { title: string; description: string; image?: string; type?: 'website' | 'article' } = $props();
	const origin = 'https://kzgrm.com';
	// Shared links need a full address; a page without its own picture uses the site's.
	const picture = $derived(!image ? `${origin}/og.png` : /^https?:\/\//.test(image) ? image : `${origin}${image.startsWith('/') ? '' : '/'}${image}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:image" content={picture} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
