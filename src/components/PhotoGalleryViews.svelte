<script lang="ts">
  type PhotoItem = {
    src: string;
    alt: string;
    caption?: string;
  };

  let { photos = [] as PhotoItem[] }: { photos?: PhotoItem[] } = $props();

  let view = $state<'grid' | 'list' | 'spotlight' | 'threeD' | 'cosmos'>('grid');
  let currentIndex = $state(0);
  let lightboxOpen = $state(false);
  let yaw = $state(0);
  let pitch = $state(0);

  const hasPhotos = $derived(photos.length > 0);
  const currentPhoto = $derived(photos[currentIndex]);

  const angleStep = $derived(photos.length > 0 ? 360 / photos.length : 0);
  const ringRotate = $derived(-currentIndex * angleStep);

  const cosmosItems = $derived.by(() => {
    if (!hasPhotos) return [] as Array<{ src: string; alt: string; x: number; y: number; z: number; r: number; s: number }>;

    const base = photos[0];
    const total = Math.max(18, photos.length * 8);
    const items: Array<{ src: string; alt: string; x: number; y: number; z: number; r: number; s: number }> = [];
    let seed = 8731;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < total; i += 1) {
      items.push({
        src: base.src,
        alt: `${base.alt}-${i + 1}`,
        x: (rand() - 0.5) * 900,
        y: (rand() - 0.5) * 520,
        z: (rand() - 0.5) * 1100,
        r: rand() * 360,
        s: 0.72 + rand() * 0.55
      });
    }
    return items;
  });

  function setView(nextView: 'grid' | 'list' | 'spotlight' | 'threeD' | 'cosmos') {
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

  function onCosmosMove(event: MouseEvent) {
    const currentTarget = event.currentTarget as HTMLElement | null;
    if (!currentTarget) return;
    const rect = currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    yaw = nx * 26;
    pitch = -ny * 18;
  }

  function resetCosmosView() {
    yaw = 0;
    pitch = 0;
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
    <button class:active={view === 'grid'} onclick={() => setView('grid')}>grid</button>
    <button class:active={view === 'list'} onclick={() => setView('list')}>list</button>
    <button class:active={view === 'spotlight'} onclick={() => setView('spotlight')}>spotlight</button>
    <button class:active={view === 'threeD'} onclick={() => setView('threeD')}>3d</button>
    <button class:active={view === 'cosmos'} onclick={() => setView('cosmos')}>cosmos</button>
  </div>

  {#if !hasPhotos}
    <p>kzgrm</p>
  {:else if view === 'grid'}
    <ul class="grid">
      {#each photos as photo, index}
        <li>
          <button class="thumb" onclick={() => openLightbox(index)}>
            <img src={photo.src} alt={photo.alt} loading="lazy" />
          </button>
        </li>
      {/each}
    </ul>
  {:else if view === 'list'}
    <ul class="list">
      {#each photos as photo, index}
        <li>
          <button class="row" onclick={() => openLightbox(index)}>
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <span>{photo.caption ?? photo.alt}</span>
          </button>
        </li>
      {/each}
    </ul>
  {:else if view === 'spotlight'}
    <section class="spotlight">
      <img src={currentPhoto.src} alt={currentPhoto.alt} />
      <p>{currentPhoto.caption ?? currentPhoto.alt}</p>
      <div class="controls">
        <button onclick={prev}>prev</button>
        <button onclick={next}>next</button>
      </div>
    </section>
  {:else if view === 'threeD'}
    <section class="three-d-wrap">
      <div class="controls">
        <button onclick={prev}>prev</button>
        <button onclick={next}>next</button>
      </div>
      <div class="scene">
        <div class="ring" style={`--ring-rotate: ${ringRotate}deg;`}>
          {#each photos as photo, index}
            <button
              class="panel"
              style={`--panel-rotate: ${index * angleStep}deg;`}
              onclick={() => openLightbox(index)}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </button>
          {/each}
        </div>
      </div>
      <p>{currentPhoto.caption ?? currentPhoto.alt}</p>
    </section>
  {:else}
    <section class="cosmos-wrap">
      <p>kzgrm cosmos view</p>
      <div
        class="cosmos-scene"
        role="application"
        aria-label="cosmos-view"
        onmousemove={onCosmosMove}
        onmouseleave={resetCosmosView}
      >
        <div class="cosmos-world" style={`transform: rotateX(${pitch}deg) rotateY(${yaw}deg);`}>
          {#each cosmosItems as item, index}
            <button
              class="cosmos-card"
              style={`transform: translate3d(${item.x}px, ${item.y}px, ${item.z}px) rotateZ(${item.r}deg) scale(${item.s});`}
              onclick={() => openLightbox(index % photos.length)}
            >
              <img src={item.src} alt={item.alt} loading="lazy" />
            </button>
          {/each}
        </div>
      </div>
      <p>mouse move: viewpoint control / click: lightbox</p>
    </section>
  {/if}
</section>

{#if lightboxOpen && hasPhotos}
  <div class="lightbox">
    <button class="backdrop" onclick={closeLightbox} aria-label="close"></button>
    <button class="nav prev" onclick={(event) => { event.stopPropagation(); prev(); }}>‹</button>
    <img src={currentPhoto.src} alt={currentPhoto.alt} />
    <button class="nav next" onclick={(event) => { event.stopPropagation(); next(); }}>›</button>
    <button class="close" onclick={(event) => { event.stopPropagation(); closeLightbox(); }}>×</button>
  </div>
{/if}

<style>
  .toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .toolbar button,
  .controls button,
  .row,
  .thumb {
    border: 1px solid #dbe1ea;
    background: #fff;
    border-radius: 0.6rem;
    padding: 0.45rem 0.7rem;
    cursor: pointer;
  }

  .toolbar button.active {
    border-color: #5a64b1;
    color: #5a64b1;
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

  .list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 0.7rem;
  }

  .row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
  }

  .row img {
    width: 96px;
    height: 64px;
    object-fit: cover;
    border-radius: 0.4rem;
  }

  .spotlight img {
    width: 100%;
    max-height: 460px;
    object-fit: contain;
    border: 1px solid #dbe1ea;
    border-radius: 0.8rem;
    background: #fff;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }

  .three-d-wrap {
    display: grid;
    gap: 0.8rem;
  }

  .scene {
    perspective: 1200px;
    height: 360px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid #dbe1ea;
    border-radius: 0.8rem;
    background:
      radial-gradient(circle at center, #ffffff 0%, #eef2ff 55%, #e2e8f0 100%);
  }

  .ring {
    position: relative;
    width: 280px;
    height: 180px;
    transform-style: preserve-3d;
    transform: rotateX(0deg) rotateY(var(--ring-rotate));
    transition: transform 380ms ease;
    will-change: transform;
  }

  .scene:hover .ring {
    transform: rotateX(12deg) rotateY(var(--ring-rotate));
  }

  .panel {
    position: absolute;
    width: 220px;
    height: 140px;
    left: 30px;
    top: 20px;
    border: 1px solid #dbe1ea;
    border-radius: 0.7rem;
    overflow: hidden;
    padding: 0;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.15);
    transform: rotateY(var(--panel-rotate)) translateZ(260px) translateY(0) scale(1);
    transition: transform 240ms ease, box-shadow 240ms ease;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .scene:hover .panel:hover {
    transform: rotateY(var(--panel-rotate)) translateZ(290px) translateY(-10px) scale(1.04);
    box-shadow: 0 18px 30px rgba(15, 23, 42, 0.28);
  }

  .panel img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 240ms ease, filter 240ms ease;
  }

  .scene:hover .panel:hover img {
    transform: scale(1.06);
    filter: saturate(1.1);
  }

  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.85);
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
    background: rgba(255, 255, 255, 0.2);
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

  .cosmos-wrap {
    display: grid;
    gap: 0.7rem;
  }

  .cosmos-scene {
    height: 520px;
    border-radius: 0.8rem;
    border: 1px solid #dbe1ea;
    overflow: hidden;
    perspective: 1400px;
    background:
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.2), transparent 30%),
      radial-gradient(circle at 80% 10%, rgba(130, 150, 255, 0.25), transparent 24%),
      linear-gradient(180deg, #0b1020 0%, #11182f 55%, #1e293b 100%);
  }

  .cosmos-world {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 220ms ease-out;
  }

  .cosmos-card {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 130px;
    height: 86px;
    margin-left: -65px;
    margin-top: -43px;
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 0.45rem;
    padding: 0;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    overflow: hidden;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
  }

  .cosmos-card:hover {
    border-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 16px 28px rgba(0, 0, 0, 0.55);
  }

  .cosmos-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>
