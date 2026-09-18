<script lang="ts">
	const modules = import.meta.glob('/src/assets/images/gallery/*.{avif,gif,jpeg,jpg,png,svg,webp}', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;

	const photos = Object.entries(modules)
		.sort(([a], [b]) => a.localeCompare(b, 'ja'))
		.map(([path, src]) => ({ src, alt: path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '' }));
</script>

<svelte:head>
	<title>写真 | かざぐるま</title>
	<meta name="description" content="かざぐるまの写真ギャラリーです。" />
</svelte:head>

<div class="masonry">
	{#each photos as photo}
		<figure><img src={photo.src} alt={photo.alt} loading="lazy" /></figure>
	{/each}
</div>

<style>
	.masonry { columns: 4 220px; column-gap: .8rem; }
	figure { overflow: hidden; break-inside: avoid; margin: 0 0 .8rem; border-radius: var(--radius); background: var(--card); }
	img { display: block; width: 100%; height: auto; transition: transform .25s ease; }
	figure:hover img { transform: scale(1.015); }
	@media (max-width: 600px) { .masonry { columns: 2 150px; } }
	@media (prefers-reduced-motion: reduce) { img { transition: none; } }
</style>
