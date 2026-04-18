<script lang="ts">
  import { flip } from 'svelte/animate';
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
  <div class="tag-buttons">
    <button
      class:active={selectedTags.length === 0}
      class="tag-btn"
      onclick={clearTags}
      type="button"
    >
      ALL
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
    <li
      class="card"
      in:fly={{ x: 28, duration: 240 }}
      out:fly={{ x: -28, duration: 220 }}
      animate:flip={{ duration: 320 }}
    >
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

  .tag-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.45rem;
  }

  .tag-btn {
    border: 1px solid rgba(20, 24, 32, 0.1);
    border-radius: 999px;
    padding: 0.32rem 0.75rem;
    background: rgba(255, 255, 255, 0.9);
    color: #334155;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(28, 31, 39, 0.04);
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .tag-btn:hover {
    border-color: rgba(109, 40, 217, 0.35);
  }

  .tag-btn.active {
    border-color: rgba(109, 40, 217, 0.45);
    color: #1e3a5f;
    background: rgba(109, 40, 217, 0.1);
    box-shadow: 0 4px 16px rgba(109, 40, 217, 0.12);
  }

  .cards {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 1rem;
  }

  .card {
    border: 1px solid rgba(30, 58, 95, 0.1);
    border-radius: 1rem;
    background: linear-gradient(180deg, #f7f8fc 0%, #eceef4 100%);
    padding: 1rem;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(30, 58, 95, 0.05);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .card:hover {
    border-color: rgba(109, 40, 217, 0.25);
    box-shadow: 0 12px 36px rgba(109, 40, 217, 0.08);
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
