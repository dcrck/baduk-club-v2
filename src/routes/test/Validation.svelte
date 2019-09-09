<script>
  import Validation from '/components/input/Validation'
  let name = ''
  const validate = n => !n ? 'Please enter a name for your meetup' : ''
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
  <Validation value={name} {validate} let:check >
    <input
      type="text"
      id="name"
      data-cy="name-input"
      class="form-input w-full"
      on:blur={() => check(name, true)}
      bind:value={name} />
  </Validation>
</label>
