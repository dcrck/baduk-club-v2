<script>
  import parse from './parsing'
  export let name, times, address, id
  export let geolocation = null
  export let last_updated = null
  export let description = ''
  export let border = false
  export let expanded = false
  export let showTime = false

  $: parsed = parse({times, address, last_updated})
</script>

<div
  data-cy="card"
  class="rounded-lg bg-white {border ? 'border border-gray-400' : 'shadow-xl'}
  p-4 pt-3">
  <h2
    data-cy="event-card-name"
    class={expanded ? 'text-5xl font-medium' : 'text-3xl font-semibold'}>
    {name}
  </h2>
  {#if showTime}
    <p class="text-sm text-gray-500" data-cy="event-card-updated">last updated: {parsed.last_updated} ago</p>
  {/if}
  <div class="{expanded ? 'text-xl' : 'text-lg'} my-5">
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
  <h4
    data-cy="event-card-address-main"
    class={expanded ? 'text-2xl font-semibold' : 'text-lg font-medium'}>
    {parsed.address.main}
  </h4>
  <p data-cy="event-card-address-rest" class:text-lg={expanded}>{parsed.address.rest}</p>
  {#if expanded}
    <hr class="my-6" />
    <div data-cy="event-card-description">
      {#each description.split('\n') as d}
        <p>{d}</p>
      {/each}
    </div>
  {/if}
</div>
