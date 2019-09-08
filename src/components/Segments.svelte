<script>
  import Icon from '/components/Icon'
  import { createEventDispatcher } from 'svelte'
  import produce from 'immer'

  export let choices = []
  export let initial = ''

  const dispatch = createEventDispatcher()
  let group = produce(initial, () => {})

  choices = choices.map(c => ({ id: c.name || c, icon: c.icon || '' }))
  const change = () => dispatch('change', { choice: group })
</script>

<style>
  .segments label {
    @apply border border-gray-800 border-r-0 bg-white px-4 py-2 flex cursor-pointer;
  }

  .segments label:first-child {
    border-radius: 0.25rem 0 0 0.25rem;
  }

  .segments label:last-child {
    @apply border-r;
    border-radius: 0 0.25rem 0.25rem 0;
  }

  .segments label.selected {
    @apply bg-gray-800 text-white cursor-default;
  }
</style>

<div class="segments flex mx-auto justify-center">
  {#each choices as { id, icon }}
    <label class:selected={group === id} for={id}>
      <input
        type="radio"
        class="hidden"
        bind:group
        value={id}
        {id}
        on:change={change} />
      {#if icon}
        <div class="mr-2">
          <Icon id={icon} color={group === id ? 'white' : '#2d3748'} />
        </div>
      {/if}
      <span>{id}</span>
    </label>
  {/each}
</div>
