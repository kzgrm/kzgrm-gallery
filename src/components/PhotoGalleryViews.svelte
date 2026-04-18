<script lang="ts">
  import { onMount } from 'svelte';

  type PhotoItem = {
    src: string;
    alt: string;
    caption?: string;
  };

  type ScatterSlot = {
    left: number;
    top: number;
    rot: number;
    z: number;
    delay: number;
    sx: number;
    sy: number;
  };

  let { photos = [] as PhotoItem[] }: { photos?: PhotoItem[] } = $props();

  let view = $state<'grid' | 'scatter'>('scatter');
  let scatterLayout = $state<ScatterSlot[]>([]);
  let scatterReady = $state(false);
  let currentIndex = $state(0);
  let lightboxOpen = $state(false);

  const hasPhotos = $derived(photos.length > 0);
  const currentPhoto = $derived(photos[currentIndex]);

  function shuffle<T>(items: T[]): T[] {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildScatterLayout(n: number): ScatterSlot[] {
    const zs = shuffle(Array.from({ length: n }, (_, i) => i + 1));
    const slots: ScatterSlot[] = [];
    const placed: { x: number; y: number }[] = [];

    for (let i = 0; i < n; i++) {
      let x = 0.5;
      let y = 0.5;
      let tries = 0;
      while (tries < 40) {
        x = 0.1 + Math.random() * 0.8;
        y = 0.06 + Math.random() * 0.82;
        const tooClose = placed.some((p) => Math.hypot((p.x - x) * 1.15, p.y - y) < 0.055);
        if (!tooClose || tries > 28) break;
        tries++;
      }
      placed.push({ x, y });

      const rot = -17 + Math.random() * 34;
      slots.push({
        left: x * 100,
        top: y * 100,
        rot,
        z: zs[i]!,
        delay: i * 52 + Math.random() * 70,
        sx: (Math.random() - 0.5) * 260,
        sy: -140 - Math.random() * 160
      });
    }
    return slots;
  }

  onMount(() => {
    if (!photos.length) return;
    scatterLayout = buildScatterLayout(photos.length);
    scatterReady = true;
  });

  function setView(nextView: 'grid' | 'scatter') {
    view = nextView;
    lightboxOpen = false;
  }

  function openLightbox(index: number) {
    currentIndex = index;
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  function next() {
    if (!hasPhotos) return;
    currentIndex = (currentIndex + 1) % photos.length;
  }

  function prev() {
    if (!hasPhotos) return;
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  }

  $effect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (!lightboxOpen) return;
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });
</script>

<section>
  <div class="toolbar">
    <button class:active={view === 'scatter'} onclick={() => setView('scatter')} type="button">random</button>
    <button class:active={view === 'grid'} onclick={() => setView('grid')} type="button">grid</button>
  </div>

  {#if !hasPhotos}
    <p>kzgrm</p>
  {:else if view === 'grid'}
    <ul class="grid">
      {#each photos as photo, index}
        <li>
          <button class="thumb" onclick={() => openLightbox(index)} type="button">
            <img src={photo.src} alt={photo.alt} loading="lazy" />
          </button>
        </li>
      {/each}
    </ul>
  {:else if scatterReady && scatterLayout.length === photos.length}
    <div class="table-wrap" aria-label="写真がランダムに重なって表示されています">
      <div class="table-surface">
        {#each photos as photo, index}
          {@const slot = scatterLayout[index]}
          <button
            class="scatter-card"
            style:--left="{slot.left}%"
            style:--top="{slot.top}%"
            style:--rot="{slot.rot}deg"
            style:--z={slot.z}
            style:--delay="{slot.delay}ms"
            style:--sx="{slot.sx}px"
            style:--sy="{slot.sy}px"
            onclick={() => openLightbox(index)}
            type="button"
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" draggable="false" />
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <p class="scatter-loading">random…</p>
  {/if}
</section>

{#if lightboxOpen && hasPhotos}
  <div class="lightbox">
    <button class="backdrop" onclick={closeLightbox} aria-label="close" type="button"></button>
    <button class="nav prev" onclick={(event) => { event.stopPropagation(); prev(); }} type="button">‹</button>
    <img src={currentPhoto.src} alt={currentPhoto.alt} />
    <button class="nav next" onclick={(event) => { event.stopPropagation(); next(); }} type="button">›</button>
    <button class="close" onclick={(event) => { event.stopPropagation(); closeLightbox(); }} type="button">×</button>
  </div>
{/if}

<style>
  .toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .toolbar button,
  .thumb {
    border: 1px solid rgba(30, 58, 95, 0.12);
    background: #f5f6fa;
    border-radius: 0.6rem;
    padding: 0.45rem 0.7rem;
    cursor: pointer;
  }

  .toolbar button.active {
    border-color: #6d28d9;
    color: #1e3a5f;
    background: rgba(109, 40, 217, 0.1);
    box-shadow: 0 2px 12px rgba(109, 40, 217, 0.15);
  }

  .grid {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
  }

  .thumb {
    width: 100%;
    padding: 0;
    overflow: hidden;
  }

  .thumb img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }

  .scatter-loading {
    color: #64748b;
    margin: 2rem 0;
  }

  .table-wrap {
    margin: 0 -0.25rem;
    padding: 0.25rem;
  }

  .table-surface {
    position: relative;
    min-height: min(78vh, 860px);
    border-radius: 1rem;
    background:
      radial-gradient(ellipse 95% 75% at 50% 0%, rgba(255, 255, 255, 0.9), transparent 58%),
      linear-gradient(168deg, #eceef4 0%, #dfe3eb 40%, #d4d9e3 100%);
    border: 1px solid rgba(30, 58, 95, 0.1);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.85),
      inset 0 -1px 0 rgba(30, 58, 95, 0.05),
      0 16px 48px rgba(30, 58, 95, 0.07);
    overflow: visible;
  }

  .scatter-card {
    position: absolute;
    left: var(--left);
    top: var(--top);
    z-index: var(--z);
    width: clamp(132px, 24vmin, 228px);
    aspect-ratio: 4 / 3;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0.4rem;
    background: #fff;
    box-shadow:
      0 2px 0 rgba(255, 255, 255, 0.65) inset,
      0 10px 28px rgba(15, 23, 42, 0.22);
    cursor: pointer;
    overflow: hidden;
    transform: translate(-50%, -50%) rotate(var(--rot));
    animation: scatter-in 0.95s cubic-bezier(0.22, 0.82, 0.28, 1) var(--delay) both;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .scatter-card:focus-visible {
    outline: 2px solid #6d28d9;
    outline-offset: 3px;
  }

  .scatter-card:hover {
    filter: brightness(1.03);
  }

  .scatter-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
    user-select: none;
  }

  @keyframes scatter-in {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) translate(var(--sx), var(--sy)) rotate(calc(var(--rot) + 6deg))
        scale(0.42);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(var(--rot)) scale(1);
    }
  }

  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(21, 42, 69, 0.88);
    backdrop-filter: blur(8px);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    padding: 1rem;
    z-index: 50;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .lightbox img {
    width: 100%;
    max-width: 1100px;
    max-height: 90vh;
    object-fit: contain;
    justify-self: center;
  }

  .nav,
  .close {
    border: none;
    background: rgba(232, 207, 58, 0.25);
    color: #fff;
    font-size: 1.8rem;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 999px;
    cursor: pointer;
  }

  .close {
    position: fixed;
    top: 0.9rem;
    right: 0.9rem;
  }

  @media (max-width: 768px) {
    .table-surface {
      min-height: min(72vh, 720px);
    }

    .scatter-card {
      width: clamp(118px, 38vw, 200px);
    }
  }
</style>
