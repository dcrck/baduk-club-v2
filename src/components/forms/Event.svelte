<script>
  import { createEventDispatcher } from 'svelte'
  import LocationSearch from '/components/input/LocationSearch'
  import TimeForm from '/components/forms/RecurrenceRule'
  import Validation from '/components/input/Validation'
  import Icon from '/components/Icon'
  import check, { initialize } from '/components/input/validate'
  import { toString } from '/utils/rrule'

  const dispatch = createEventDispatcher()

  let error = n => (!n ? 'Please enter a name for your meetup' : '')

  export let initial = {
    address: '',
    times: [],
    name: '',
    is_private: false,
    description: '',
    geolocation: null,
  }
  export let resetOnSubmit = false

  let current, refresh, state
  reset()
  $: reset(initial)

  $: current && validate(current.name)

  function reset() {
    current = JSON.parse(JSON.stringify(initial))
    refresh ^= true
    state = initialize(current.name, error)
  }

  function validate(n, first = false) {
    state = check(first || state.status !== 'initial', error, n) || state
  }

  function submit() {
    const { description, ...rest } = current
    dispatch('submit', {
      data: {
        ...rest,
        ...(description
          ? { description: encodeURIComponent(description) }
          : {}),
      },
    })
    if (resetOnSubmit) reset()
  }

  function cancel() {
    dispatch('cancel')
    reset()
  }
  const removeTime = i =>
    (current.times = current.times
      .slice(0, i)
      .concat(current.times.slice(i + 1)))
  const addTime = ({ detail: { time } }) =>
    (current.times = [...current.times, time])

  const selectLocation = ({ detail }) => (current = { ...current, ...detail })
  const clearLocation = () =>
    (current = { ...current, address: '', geolocation: null })

  $: disabled = !(
    JSON.stringify(initial) !== JSON.stringify(current) &&
    state.status === 'ok' &&
    current.geolocation &&
    current.times.length
  )
</script>

<style>
  .form-label {
    @apply pb-8;
  }

  .form-input {
    @apply px-3 py-2 border rounded border-gray-400;
  }

  .form-input:focus {
    @apply border-gray-800;
  }
</style>

<div class="flex flex-col">
  <label for="name" class="form-label">
    Name
    <Validation {...state}>
      <input
        type="text"
        id="name"
        data-cy="name-input"
        class="form-input w-full"
        bind:value={current.name}
        on:blur={() => validate(current.name, true)} />
    </Validation>
  </label>

  <label for="address" class="form-label">
    Address
    <LocationSearch
      id="address"
      initial={current.address}
      on:select={selectLocation}
      on:clear={clearLocation}
      {refresh}
      placeholder="Where are you meeting? (start typing!)" />
  </label>

  <label for="times">Meeting Time(s)</label>
  {#each current.times as time, i}
    <div class="flex items-center text-xl">
      <span class="mr-4">{toString(time, !time.rrule)}</span>
      <button
        data-cy="remove-time"
        class="opacity-50 hover:opacity-100"
        on:click={() => removeTime(i)}>
        <Icon id="x" />
      </button>
    </div>
  {/each}

  {#if current.times.length !== 1 || !current.times.length || current.times[0].rrule}
    <div class="flex-0">
      <TimeForm on:submit={addTime} />
    </div>
  {/if}

  <label class="my-4 inline-block w-full" for="description">
    Description
    <textarea
      bind:value={current.description}
      id="description"
      class="border-gray-400 w-full border focus:border-gray-800 rounded py-2
      px-3"
      placeholder="What do members need to know about your meetup?" />
  </label>

  <label class="my-4 inline-block w-full flex items-center" for="private">
    <input
      type="checkbox"
      id="private"
      class="-mt-px mr-2"
      bind:value={current.is_private} />
    This meetup is invite-only
  </label>

  <div class="flex items-center justify-between">
    <button
      data-cy="cancel-event-form"
      class="bg-white border-2 border-gray-800 rounded px-4 py-2 mr-2"
      on:click={cancel}>
      Cancel
    </button>
    <button
      {disabled}
      data-cy="submit-event-form"
      on:click={submit}
      class="my-4 {disabled ? 'opacity-25 cursor-not-allowed ' : ''}px-4 py-2
      bg-gray-800 rounded text-white">
      Submit
    </button>
  </div>
</div>
