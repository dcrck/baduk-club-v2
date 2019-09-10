<script>
  import Icon from '/components/Icon'
  export let status = ''
  export let error = ''
  export let icon = ''
  let icons = {
    initial: {id: icon, color: '#2d3748'},
    loading: { id: 'loader', color: '#cbd5e0' },
    ok: { id: 'check', color: '#68d391' },
    error: { id: 'x', color: '#e53e3e' },
  }
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
    <span class="inset-icon" data-cy="validation-status-{status}">
      <Icon {...icons[status]} />
    </span>
  </div>

  {#if error}
    <span class="absolute text-red-500 text-xs italic" data-cy="validation-error">{error}</span>
  {/if}
</div>
