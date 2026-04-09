<script lang="ts">
  type ActivityItem = {
    title: string;
    url: string;
    date: string;
    summary: string;
    tags: string[];
  };

  export let activities: ActivityItem[] = [];

  let selectedTag = 'すべて';

  $: tags = ['すべて', ...new Set(activities.flatMap((item) => item.tags))];
  $: filteredActivities =
    selectedTag === 'すべて'
      ? activities
      : activities.filter((item) => item.tags.includes(selectedTag));
</script>

<div class="filter">
  <label for="tag">タグで絞り込み:</label>
  <select id="tag" bind:value={selectedTag}>
    {#each tags as tag}
      <option value={tag}>{tag}</option>
    {/each}
  </select>
</div>

<ul class="cards">
  {#each filteredActivities as activity}
    <li class="card">
      <a href={activity.url}><h3>{activity.title}</h3></a>
      <p class="meta">{activity.date}</p>
      <p>{activity.summary}</p>
      <p class="tags">{activity.tags.join(' / ')}</p>
    </li>
  {/each}
</ul>

<style>
  .filter {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    margin: 1.2rem 0;
  }

  select {
    border: 1px solid #dbe1ea;
    border-radius: 0.5rem;
    padding: 0.35rem 0.6rem;
    background: #fff;
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
  }

  .card a {
    color: #0f172a;
    text-decoration: none;
  }

  .meta,
  .tags {
    color: #475569;
    margin: 0.4rem 0;
    font-size: 0.94rem;
  }
</style>
