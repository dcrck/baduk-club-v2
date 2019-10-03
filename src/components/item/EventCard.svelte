<script>
  import parse from './parsing'
  export let name, times, address, id
  export let geolocation = null
  export let last_updated = null
  export let description = ''
  export let border = false
  export let expanded = false
  export let showTime = false

  $: gmapsLink = `https://maps.google.com/?q=${address}`

  $: parsed = parse({ times, address, last_updated })
</script>

<style>
  .event-card {
    @apply rounded-lg bg-white p-4 pt-3 shadow-xl;
  }
  .event-card.border {
    @apply shadow-none border border-gray-400;
  }
  a.expanded {
    @apply text-2xl font-semibold;
  }
  h2 {
    @apply text-3xl font-semibold;
  }
  @media screen and (min-width: 1024px) {
    h2.expanded {
      @apply text-5xl font-medium;
    }
  }
</style>

<div data-cy="event-card" class="event-card" class:border>
  <h2
    data-cy="event-card-name"
    class="w-3/4 md:w-10/12 lg:w-11/12"
    class:expanded>
    {name}
  </h2>
  {#if showTime}
    <p class="text-sm text-gray-500" data-cy="event-card-updated">
      last updated: {parsed.last_updated} ago
    </p>
  {/if}
  <div class="text-lg my-5" class:text-xl={expanded}>
    {#each parsed.times as { rrule, start, end }}
      <div data-cy="event-card-time">
        {#if rrule}
          <span>{rrule}</span>
          <span>{start}</span>
          <span>-</span>
          <span>{end}</span>
        {:else}
          <div>
            <span>Starts:</span>
            <span>{start}</span>
          </div>
          <div>
            <span>Ends:</span>
            <span>{end}</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
  <a href={gmapsLink}
     target="_blank"
     rel="noopener"
     data-cy="event-card-address-main"
     class="text-lg font-medium text-blue-600 hover:underline"
     class:expanded>
    {parsed.address.main}
  </a>
  <p data-cy="event-card-address-rest" class:text-lg={expanded}>
    {parsed.address.rest}
  </p>
  {#if expanded && description}
    <hr class="my-6" />
    <div data-cy="event-card-description">
      {#each description.split('\n') as d}
        <p>{d}</p>
      {/each}
    </div>
  {/if}
</div>
