<script>
  import Validation from '/components/input/Validation'
  let name = ''
  let state = { status: 'initial' }
  function validate(n, first = false) {
    if (first || state.status !== 'initial') {
      const error = !n ? 'Please enter a name for your meetup' : ''
      state = { status: error ? 'error' : 'ok', error }
      return !error
    }
    return true
  }

  $: validate(name)
</script>

<style>
  .form-input {
    @apply px-3 py-2 border rounded border-gray-400;
  }

  .form-input:focus {
    @apply border-gray-800;
  }
</style>

<label for="name" class="form-label">
  Name
  <Validation {...state}>
    <input
      type="text"
      id="name"
      data-cy="name-input"
      class="form-input w-full"
      on:blur={() => validate(name, true)}
      bind:value={name} />
  </Validation>
</label>
