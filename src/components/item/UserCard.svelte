<script>
  import Icon from '/components/Icon'
  import parse from './parsing'
  export let name, rank, id
  export let attendance = {}
  export let last_updated = ''
  export let address = ''
  export let picture = ''
  export let geolocation = null
  export let show_location = false
  export let isOrganizer = false
  export let border = false
  export let email = ''

  let icons = { confirmed: 'check', paid: 'dollar-sign', checked_in: 'map-pin' }

  $: _picture = picture ? picture : 'default.png'
  $: parsed = parse({ last_updated })
</script>

<style>
  .user-card {
    @apply shadow-xl items-center rounded-lg bg-white p-4 pt-3 flex justify-between;
  }
  .user-card.border {
    @apply border border-gray-400;
  }
  .user-card.address {
    @apply items-start;
  }
</style>

<div
  data-cy="user-card"
  class:border
  class:address={!!geolocation}
  class="user-card">
  <div class="flex">
    <img
      src={_picture}
      alt={name}
      class="w-24 h-24 rounded-full"
      data-cy="user-card-picture" />
    <div class="flex flex-col ml-4 justify-between items-start">
      <span class="font-medium text-lg" data-cy="user-card-name">{name}</span>
      {#if isOrganizer}
        <span
          data-cy="user-card-organizer"
          class="bg-gray-300 py-1 px-2 rounded-full uppercase text-xs
          text-gray-500 tracking-widest leading-none">
          Organizer
        </span>
      {/if}
      {#if geolocation}
        <a
          href="mailto:{email}"
          target="_blank"
          class="text-blue-500 hover:underline">
          Contact
        </a>
      {/if}
      {#if attendance}
        <div class="flex">
          {#each Object.keys(attendance) as k}
            <div
              class="{attendance[k] ? 'opacity-100' : 'opacity-25'} mr-6"
              data-cy="user-card-{k}">
              <Icon id={icons[k]} />
            </div>
          {/each}
        </div>
      {/if}
      {#if last_updated}
        <p class="text-sm text-gray-500" data-cy="user-card-updated">
          last updated: {parsed.last_updated} ago
        </p>
      {/if}
    </div>
  </div>
  {#if rank}
    <div class="flex flex-col items-center mr-6" data-cy="user-card-rank">
      <span class="text-2xl">{rank}</span>
      <span class="text-sm">rank</span>
    </div>
  {/if}
</div>
