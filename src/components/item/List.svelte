<script>
  import Icon from '/components/Icon'
  import Fuse from 'fuse.js'

  export let items = []
  export let options = {}
  export let component = false
  export let types = { singular: 'Item', plural: 'Items' }
  export let placeholder = 'Search...'
  export let border = false

  let results = []
  let query = ''

  const setResults = (fuse, query, items) =>
    (results = query ? fuse.search(query) : items)
  const refilter = (query, items) =>
    setResults(new Fuse(items, options), query, items)

  $: refilter(query, items)
</script>

<style>
  .inset-icon {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
  }

  input:focus + .inset-icon {
    opacity: 1;
  }
</style>

<div class="flex justify-between items-center my-6">
  <span class="font-bold mr-6">
    {results.length} {results.length === 1 ? types.singular : types.plural}
  </span>
  <div class="relative flex-grow">
    <input
      bind:value={query}
      type="text"
      data-cy="list-text-search"
      {placeholder}
      class="w-full p-2 bg-white border border-gray-400 rounded-sm
      focus:border-gray-800" />
    <div class="inset-icon">
      <Icon id="search" />
    </div>
  </div>
</div>

<div>
  {#each results as result}
    <div class="mb-8">
      <svelte:component this={component} {...result} {border} />
    </div>
  {:else}
    <slot name="no-results">
      <p class="text-center text-gray-500 text-2xl">No results</p>
    </slot>
  {/each}
</div>
