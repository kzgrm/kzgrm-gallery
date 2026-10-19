<script lang="ts">
 import { page } from '$app/state';
 import KazashimoNotFound from '$lib/components/KazashimoNotFound.svelte';
</script>

<svelte:head><title>{page.status === 404 ? 'Kazashimo Not Found' : page.status} | かざぐるま</title></svelte:head>

{#if page.status === 404}
 <KazashimoNotFound />
{:else}
 <main style="padding: 3rem 1.5rem; font-family: sans-serif;">
  <h1>{page.status}</h1>
  <p>{page.error?.message ?? 'ページを表示できませんでした。'}</p>
  <a href="/" data-sveltekit-reload>ホームへ戻る</a>
 </main>
{/if}
