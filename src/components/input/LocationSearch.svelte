<script>
  import { createEventDispatcher } from 'svelte'
  import { debounce } from '/utils/index'
  import * as mapbox from '/api/mapbox'
  import Validation from '/components/input/Validation'
  import check, { initialize, load } from './validate'
  export let id = 'location'
  export let placeholder = 'search term'
  export let initial = ''
  export let refresh = false
  let results, searching, state
  let location = {}
  const dispatch = createEventDispatcher()

  const error = ({ address, geolocation }) =>
    (address && !geolocation) || !address
      ? 'Please make sure to select your address from the results list'
      : ''

  function reset(refresh) {
    location = { address: initial || '', geolocation: null }
    state = initialize(location, error)
  }

  reset(true)

  $: state = load(searching)
  $: reset(refresh)

  function search() {
    dispatch('clear')
    location.geolocation = null
    mapbox.search(location.address).then(r => {
      searching = false
      results = r
    })
  }

  function showError() {
    results = undefined
    state = check(true, error, location)
  }

  const debouncedSearch = debounce(search, 500)
  const debouncedError = debounce(showError, 200)

  function onInput() {
    searching = !!location.address
    return searching ? debouncedSearch() : (results = undefined)
  }

  function setInput({ place_name, center: [lng, lat] }) {
    location = { address: place_name, geolocation: { lat, lng } }
    results = undefined
    dispatch('select', location)
  }
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
      bind:value={location.address}
      on:input={onInput}
      on:blur={debouncedError} />
  </Validation>
  {#if searching || results}
    <ul class="absolute z-20 w-full bg-white shadow-md">
      {#if searching}
        <li>Searching...</li>
      {:else if location.address && !results.length}
        <li class="text-gray-600 italic text-sm">
          No results. Is your address missing? please
          <a
            href="mailto:support@baduk.club"
            class="text-blue-500 hover:underline">
            let us know
          </a>
          .
        </li>
      {:else if location.address}
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
