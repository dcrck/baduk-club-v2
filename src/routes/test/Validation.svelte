<script>
  import Validation from '/components/input/Validation'
  import check, { initialize } from '/components/input/validate'

  let name = ''
  const error = n => (!n ? 'Please enter a name for your meetup' : '')
  let state = initialize(name, error)

  const validate = (n, first = false) =>
    (state = check(first || state.status !== 'initial', error, n) || state)

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
