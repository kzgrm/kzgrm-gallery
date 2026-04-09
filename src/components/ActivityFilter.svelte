<script lang="ts">
  import { fly } from 'svelte/transition';

  type ActivityItem = {
    title: string;
    url: string;
    date: string;
    thumnail: string;
    tags: string[];
  };

  let { activities = [] as ActivityItem[] }: { activities?: ActivityItem[] } = $props();

  let selectedTags = $state<string[]>([]);

  const tags = $derived([...new Set(activities.flatMap((item) => item.tags))]);
  const filteredActivities = $derived(
    selectedTags.length === 0
      ? activities
      : activities.filter((item) => selectedTags.every((tag) => item.tags.includes(tag)))
  );

  function toggleTag(tag: string) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((item) => item !== tag)
      : [...selectedTags, tag];
  }

  function clearTags() {
    selectedTags = [];
  }
</script>

<div class="filter">
  <span class="filter-label">tags:</span>
  <div class="tag-buttons">
    <button
      class:active={selectedTags.length === 0}
      class="tag-btn"
      onclick={clearTags}
      type="button"
    >
      all
    </button>
    {#each tags as tag}
      <button
        class="tag-btn"
        class:active={selectedTags.includes(tag)}
        onclick={() => toggleTag(tag)}
        type="button"
      >
        {tag}
      </button>
    {/each}
  </div>
</div>

<ul class="cards">
  {#each filteredActivities as activity (activity.url)}
    <li class="card" in:fly={{ x: 28, duration: 240 }} out:fly={{ x: -28, duration: 220 }}>
      <div class="preview-bg" aria-hidden="true" style={`background-image: url('${activity.thumnail}');`}></div>
      <a href={activity.url} class="content">
        <h3>{activity.title}</h3>
        <p class="meta">{activity.date}</p>
        <p class="tags">{activity.tags.join(' / ')}</p>
      </a>
    </li>
  {/each}
</ul>

<style>
  .filter {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.8rem;
    margin: 1.2rem 0;
  }

  .filter-label {
    color: #475569;
    padding-top: 0.35rem;
    white-space: nowrap;
  }

  .tag-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.45rem;
  }

  .tag-btn {
    border: 1px solid #dbe1ea;
    border-radius: 0.5rem;
    padding: 0.3rem 0.65rem;
    background: #fff;
    color: #334155;
    cursor: pointer;
  }

  .tag-btn.active {
    border-color: #5a64b1;
    color: #5a64b1;
    background: #eef2ff;
  }

  .cards {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 1rem;
  }

  .card {
    border: 1px solid #dbe1ea;
    border-radius: 0.75rem;
    background: #fff;
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .content {
    display: block;
    position: relative;
    z-index: 2;
    color: #0f172a;
    text-decoration: none;
  }

  .preview-bg {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    left: 20%;
    z-index: 1;
    pointer-events: none;
    background-size: cover;
    background-position: center;
    border-radius: 0.55rem;
    opacity: 0.22;
    overflow: clip;
    transform: translateX(0);
    transition: transform 260ms ease, opacity 260ms ease;
  }

  .card:hover .preview-bg {
    transform: translateX(-10px);
    opacity: 0.32;
  }

  h3 {
    margin: 0 0 0.35rem;
  }

  .meta,
  .tags {
    color: #475569;
    margin: 0.4rem 0;
    font-size: 0.94rem;
  }

  @media (max-width: 768px) {
    .filter {
      flex-direction: column;
      align-items: stretch;
    }

    .tag-buttons {
      justify-content: flex-start;
    }
  }
</style>
