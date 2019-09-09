<script>
  import Icon from '/components/Icon'
  export let icon = ''
  export let validate = () => {}
  export let value

  let icons = {
    initial: { id: icon, color: '#2d3748' },
    loading: { id: 'loader', color: '#cbd5e0' },
    ok: { id: 'check', color: '#68d391' },
    error: { id: 'x', color: '#e53e3e' },
  }

  let state = { status: 'initial' }

  const setState = e => state = { status: e ? 'error' : 'ok', error: e }

  const check = (v, trigger = false) =>
    trigger || state.status !== 'initial'
    ? setState(validate(v))
    : true

  $: check(value)
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
  <div class="relative" class:error={state.error}>
    <slot {check}/>
    <span class="inset-icon">
      <Icon {...icons[state.status]} />
    </span>
  </div>

  {#if state.error}
    <span data-cy="validation-error" class="absolute text-red-500 text-xs italic">
      {state.error}
    </span>
  {/if}
</div>
