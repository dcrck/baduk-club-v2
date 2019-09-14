<script>
  import LocationSearch from '/components/input/LocationSearch'
  import Validation from '/components/input/Validation'
  import check, { initialize } from '/components/input/validate'
  import { createEventDispatcher } from 'svelte'

  export let initial = {
    location: { address: '', geolocation: null },
    bio: '',
  }
  let current, state
  let refresh = false

  const dispatch = createEventDispatcher()
  const error = v =>
    !v ? 'Please enter a description for your meeting place' : ''

  reset()

  function reset() {
    current = JSON.parse(JSON.stringify(initial))
    state = initialize(current.bio, error)
    refresh ^= true
  }

  const validate = (n, first = false) =>
    (state = check(first || state.status !== 'initial', error, n) || state)

  $: validate(current.bio)

  $: disabled = !(
    current &&
    JSON.stringify(current) !== JSON.stringify(initial) &&
    current.bio &&
    current.location.geolocation
  )

  const onSelect = ({ detail }) => (current.location = { ...detail })

  const clearLocation = () =>
    (current.location = { address: '', geolocation: null })

  function submit() {
    dispatch('submit', { data: current })
    reset()
  }
  function cancel() {
    dispatch('cancel')
    reset()
  }
</script>

<label for="address" class="form-label">
  Address
  <LocationSearch
    id="address"
    initial={current.location.address}
    on:select={onSelect}
    on:clear={clearLocation}
    {refresh}
    placeholder="Where are you meeting? (start typing!)" />
</label>
<label class="my-4 inline-block w-full" for="description">
  Description
  <Validation {...state}>
    <textarea
      bind:value={current.bio}
      id="description"
      class="border-gray-400 w-full border focus:border-gray-800 rounded py-2
      px-3"
      placeholder="How can people set up a time to play Go with you?"
      on:blur={() => validate(current.bio, true)} />
  </Validation>
</label>
<div class="flex items-center justify-between">
  <button
    data-cy="cancel-user-location"
    class="bg-white border-2 border-gray-800 rounded px-4 py-2 mr-2"
    on:click={cancel}>
    Cancel
  </button>
  <button
    {disabled}
    data-cy="submit-user-location"
    on:click={submit}
    class="my-4 {disabled ? 'opacity-25 cursor-not-allowed ' : ''}px-4 py-2
    bg-gray-800 rounded text-white">
    Submit
  </button>
</div>