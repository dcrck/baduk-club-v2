<script>
  import LocationSearch from '/components/input/LocationSearch'
  import { createEventDispatcher } from 'svelte'

  export let initial = {
    location: { address: '', geolocation: null },
    show_location: false,
  }

  export let resetOnSubmit = false
  let current
  let refresh = false

  const dispatch = createEventDispatcher()

  $: reset(initial)

  function reset() {
    current = JSON.parse(JSON.stringify(initial))
    refresh ^= true
  }

  $: disabled = !(
    current &&
    JSON.stringify(current) !== JSON.stringify(initial) &&
    (!current.show_location || current.location.geolocation)
  )

  const onSelect = ({ detail }) => (current.location = { ...detail })

  const clearLocation = () =>
    (current.location = { address: '', geolocation: null })

  const helpText = {
    true:
      'You can remove yourself from the map at any time from your profile settings',
    false:
      'By checking this, I understand the risks with sharing my approximate location publicly',
  }

  const fix = x =>
    typeof x === 'string' ? parseFloat(x).toFixed(2) : x.toFixed(2)
  const truncate = ({ lat, lng }) => ({ lat: fix(lat), lng: fix(lng) })

  function submit() {
    const {
      location: { geolocation, address },
      show_location,
    } = current
    dispatch('submit', {
      data: {
        geolocation: geolocation ? truncate(geolocation) : null,
        address,
        show_location,
      },
    })
    if (resetOnSubmit) reset()
  }
  function cancel() {
    dispatch('cancel')
    reset()
  }
</script>

<style>
  input + div {
    @apply bg-gray-500 absolute inset-0 cursor-pointer rounded-full;
    transition: 0.4s;
  }
  input + div:before {
    @apply absolute rounded-full bg-white;
    content: '';
    top: 0.125rem;
    left: 0.125rem;
    width: 1.75rem;
    height: 1.75rem;
    transition: 0.4s;
    transform: translateX(0);
  }
  input:checked + div {
    @apply bg-blue-500;
  }
  input:checked + div:before {
    transform: translateX(2rem);
  }
</style>

<div class="mb-4">
  <p class="mb-2">Show my approximate location and contact info publicly:</p>
  <div class="flex items-center justify-between mb-1">
    <span>{current.show_location ? 'Yes' : 'No'}</span>
    <label for="show-location" class="inline-block relative w-16 h-8">
      <input
        type="checkbox"
        bind:checked={current.show_location}
        id="show-location"
        class="hidden" />
      <div />
    </label>
  </div>
  <p class="text-xs italic" class:font-semibold={!current.show_location}>
    {helpText[current.show_location]}
  </p>
</div>
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
<p class="text-xs italic my-4">
  We only use your approximate location on the map, never your specific address
</p>
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
