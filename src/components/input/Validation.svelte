<script>
  import Icon from '/components/Icon'
  import { onMount } from 'svelte'
  export let status = ''
  export let error = ''
  export let iconIds = {}
  let icons = {
    initial: {},
    loading: { id: 'loader', color: '#cbd5e0' },
    ok: { id: 'check', color: '#68d391' },
    error: { id: 'x', color: '#e53e3e' },
  }

  onMount(() => {
    icons = {
      ...icons,
      ...Object.entries(iconIds).reduce(
        (o, [k, id]) => ({ ...o, [k]: { id, color: icons[k].color } }),
        {}
      ),
    }
  })
</script>

<style>
  .inset-icon {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  div.error > :global(input),
  div.error > :global(input:focus) {
    @apply border-red-500;
  }
</style>

<div class="relative">
  <div class="relative{error ? ' error' : ''}">
    <slot />
    {#if icons[status].id}
      <span class="inset-icon">
        <Icon {...icons[status]} />
      </span>
    {/if}
  </div>

  {#if error}
    <span data-cy="validation-error" class="absolute text-red-500 text-xs italic">{error}</span>
  {/if}
</div>
