<script>
  import LocationSearch from '/components/input/LocationSearch'
  import Validation from '/components/input/Validation'
  import check, { initialize } from '/components/input/validate'

  export let initial = {
    location: { address: '', geolocation: null },
    bio: ''
  }
  let current, state
  let refresh = false
  reset()

  export let submit = () => Promise.resolve()
  export let cancel = () => Promise.resolve()
  function error(v) {
    return (!v ? 'Please enter a description for your meeting place' : '')
  }

  function reset () {
    current = JSON.parse(JSON.stringify(initial))
    state = initialize(current.bio, error)
    refresh ^= true
  }

  const validate = (n, first = false) =>
    (state = check(first || state.status !== 'initial', error, n) || state)

  $: validate(current.bio)

  $: disabled = !(current && JSON.stringify(current) !== JSON.stringify(initial)
     && current.bio && current.location.geolocation)

  const onSelect = ({ detail }) => current.location = { ...detail }

  const clearLocation = () => current.location = { address: '', geolocation: null }

  const clickSubmit = () => submit(current).then(reset)
  const clickCancel = () => cancel().then(reset)

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
      class="border-gray-400 w-full border focus:border-gray-800 rounded py-2 px-3"
      placeholder="How can people set up a time to play Go with you?"
      on:blur={() => validate(current.bio, true)} />
  </Validation>
</label>
<div class="flex items-center justify-between">
  <button on:click={clickCancel} data-cy="cancel-user-location">
    Cancel
  </button>
  <button on:click={clickSubmit} {disabled} data-cy="submit-user-location">
    Submit
  </button>
</div>
