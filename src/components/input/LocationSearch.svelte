<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { debounce } from '/utils/index'
  import * as mapbox from '/api/mapbox'
  import Validation from '/components/input/Validation'
  export let id = 'location'
  export let placeholder = 'search term'
  export let initial = ''
  let results, geolocation
  let address = ''
  let searching = false
  const dispatch = createEventDispatcher()

  let state = initial ? { status: 'ok' } : { status: 'initial' }

  function search() {
    dispatch('clear')
    mapbox.search(address).then(r => {
      searching = false
      state = { status: 'initial' }
      results = r
    })
  }

  function showError() {
    results = undefined
    if ((address && state.status !== 'ok') || !address)
      state = {
        status: 'error',
        error: 'Please make sure to select your address from the results list',
      }
  }

  const debouncedSearch = debounce(search, 500)
  const debouncedError = debounce(showError, 200)

  function onInput() {
    searching = !!address
    if (searching) {
      state = { status: 'loading' }
      debouncedSearch()
    } else {
      results = undefined
    }
  }

  function setInput({ place_name, center: [lng, lat] }) {
    address = place_name
    results = undefined
    geolocation = { lat, lng }
    state = { status: 'ok' }
    dispatch('select', { address, geolocation })
  }

  onMount(() => (address = initial || ''))
</script>

<style>
  li {
    @apply border-gray-300 cursor-pointer border border-t-0 py-2 px-3;
  }

  li:last-child {
    border-radius: 0 0 0.25em 0.25em;
  }

  li:hover {
    @apply bg-gray-200;
  }
</style>

<div class="relative">
  <Validation {...state}>
    <input
      type="text"
      {id}
      {placeholder}
      class="border-gray-400 focus:border-gray-800 w-full border rounded py-2
      px-3"
      bind:value={address}
      on:input={onInput}
      on:blur={debouncedError} />
  </Validation>
  {#if searching || results}
    <ul class="absolute z-20 w-full bg-white shadow-md">
      {#if searching}
        <li>Searching...</li>
      {:else if address && !results.length}
        <li class="text-gray-600 italic text-sm">
          No results. Is your address missing? please
          <a
            href="mailto:support@baduk.club"
            class="text-blue-500 hover:underline">
            let us know
          </a>
          .
        </li>
      {:else if address}
        {#each results as result}
          <li data-cy="search-result" on:click={() => setInput(result)}>
            {result.place_name}
          </li>
        {/each}
        <li class="text-gray-600 italic text-sm">
          Is your address missing? Please
          <a
            href="mailto:support@baduk.club"
            class="text-blue-500 hover:underline">
            let us know
          </a>
          .
        </li>
      {/if}
    </ul>
  {/if}
</div>
