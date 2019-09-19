<script>
  import Icon from '/components/Icon'
  import Fuse from 'fuse.js'

  export let items = []
  export let options = {}
  export let component = false
  export let types = { singular: 'Item', plural: 'Items' }
  export let placeholder = 'Search...'
  export let itemProps = {}
  export let add = null
  export let click = null
  export let del = null

  let results = []
  let query = ''
  let { border } = itemProps

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
  .clickable {
    transition: 200ms;
    transform: none;
  }
  .clickable:hover {
    transform: translateY(-0.5rem);
  }

  .clickable.b:hover {
    @apply shadow-xl;
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
  {#if add}
    <button
      on:click={add}
      data-cy="add-new-{types.singular}"
      class="w-full my-4 px-6 py-4 bg-gray-700 hover:bg-gray-800 flex
      items-center rounded-lg justify-center">
      <div class="mr-1">
        <Icon id="plus" color="white" size="28" />
      </div>
      <span class="md:text-lg font-semibold text-white">
        Add New {types.singular}
      </span>
    </button>
  {/if}
  {#each results as result}
    <div class="relative">
      {#if del}
        <button
          data-cy="del-{types.singular}-{result.id}"
          on:click={() => del(result)}
          class="absolute left-0 -ml-8 opacity-25 hover:opacity-100">
          <Icon id="trash-2" />
        </button>
      {/if}
      {#if click}
        <a
          href={click(result)}
          rel="prefetch"
          class="block mb-8 clickable"
          class:b={border}>
          <svelte:component this={component} {...result} {...itemProps} />
        </a>
      {:else}
        <div class="mb-8">
          <svelte:component this={component} {...result} {...itemProps} />
        </div>
      {/if}
    </div>
  {:else}
    <slot name="no-results">
      <p class="text-center text-gray-500 text-2xl">No results</p>
    </slot>
  {/each}
</div>
