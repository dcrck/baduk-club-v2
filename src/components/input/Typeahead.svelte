<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { debounce } from '/utils/index'
  import Fuse from 'fuse.js'
  import Validation from '/components/input/Validation'
  import check, { initialize, load } from './validate.js'
  export let initial = ''
  export let key
  export let errorMessage = 'Please pick an item from the list'
  export let items = []
  export let placeholder

  let results, fuse, selected
  let query = ''
  let options = { keys: [key] }
  const dispatch = createEventDispatcher()

  $: fuse = new Fuse(items, options)
  $: if (selected && selected[key]) setInput(selected, false)

  const error = ({ [key]: value }) => (value ? '' : errorMessage)

  let state = initialize({ [key]: initial }, error)

  function search() {
    dispatch('clear')
    results = fuse.search(query)
    state = load(!results.length)
    selected = results.find(r => r[key] === query) || {}
  }

  function showError() {
    results = undefined
    state = check(state.status !== 'ok', error, selected)
  }

  const debouncedError = debounce(showError, 200)

  function setInput(result, set = true) {
    if (set) {
      selected = { ...result }
      query = result[key]
    }
    results = undefined
    state = check(true, error, selected)
    dispatch('select', { result })
  }

  onMount(() => {
    query = initial || ''
    selected = items.find(i => i[key] === query) || {}
  })
</script>

<style>
  li {
    @apply border-gray-300 cursor-pointer border border-t-0 py-2 px-3;
  }

  li:last-child {
    border-radius: 0 0 0.25em 0.25em;
  }

  li:hover {
    @apply bg-gray-100;
  }
</style>

<div class="relative">
  <Validation {...state} icon="chevron-down">
    <input
      type="text"
      data-cy="typeahead"
      {placeholder}
      class="border-gray-400 focus:border-gray-800 w-full border rounded py-2
      px-3"
      bind:value={query}
      on:input={search}
      on:blur={debouncedError} />
  </Validation>
  {#if results}
    <ul class="absolute z-20 w-full bg-white shadow-md">
      {#if query && !results.length}
        <li class="text-gray-600 italic">No results</li>
      {:else if query}
        {#each results as result}
          <li data-cy="typeahead-result" on:click={() => setInput(result)}>
            {result[key]}
          </li>
        {/each}
      {/if}
    </ul>
  {/if}
</div>
