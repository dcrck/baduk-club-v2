<script>
  import Icon from '/components/Icon'
  import { createEventDispatcher } from 'svelte'

  export let choices = []
  export let initial = ''

  const dispatch = createEventDispatcher()
  $: group = initial

  $: choices = choices.map(c => ({
    _id: `__${c.name || c}__`,
    id: c.name || c,
    icon: c.icon || '',
  }))
  const change = () => dispatch('change', { choice: group })
  const color = (g, i) => (g === i ? 'white' : '#2d3748')
</script>

<style>
  .segments label {
    @apply border border-gray-800 border-r-0 bg-white px-4 py-2 flex cursor-pointer items-center;
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
  {#each choices as { _id, id, icon }}
    <label class:selected={group === id} for={_id}>
      <input
        type="radio"
        class="hidden"
        bind:group
        value={id}
        id={_id}
        on:change={change} />
      {#if icon}
        <div class="mr-2">
          <Icon id={icon} size="18" color={color(group, id)} />
        </div>
      {/if}
      <span>{id}</span>
    </label>
  {/each}
</div>
