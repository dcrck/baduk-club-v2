<script>
  import { createEventDispatcher } from 'svelte'
  import { cubicOut } from 'svelte/easing'
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

  let showRRuleForm = false
  const toggleRRuleForm = () => (showRRuleForm ^= true)

  reset()
  $: reset(initial)

  $: current && validate(current.name)

  function reset() {
    current = JSON.parse(JSON.stringify(initial))
    refresh ^= true
    showRRuleForm = false
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
          : { description: '' }),
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

  const addTime = ({ detail: { time } }) => {
    current.times = [...current.times, time]
    toggleRRuleForm()
  }

  const selectLocation = ({ detail }) => (current = { ...current, ...detail })
  const clearLocation = () =>
    (current = { ...current, address: '', geolocation: null })

  $: forceTimes =
    current.times.length && current.times[0].rrule
      ? ['weekly', 'monthly']
      : ['weekly', 'monthly', 'once']
  $: disabled = !(
    JSON.stringify(initial) !== JSON.stringify(current) &&
    state.status === 'ok' &&
    current.geolocation &&
    current.times.length
  )

  const grow = (node, params) => ({
    delay: params.delay || 0,
    duration: params.duration || 400,
    easing: params.easing || cubicOut,
    css: t => `height: ${t * 400}px; opacity: ${t}`,
  })
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

  button:disabled {
    @apply cursor-not-allowed opacity-25;
  }

  input:disabled {
    @apply cursor-not-allowed;
  }
</style>

<div class="flex flex-col mb-8">
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
    {#if !showRRuleForm}
      <button
        on:click={toggleRRuleForm}
        data-cy="new-time"
        class="px-3 my-2 py-2 flex items-center justify-center bg-gray-700
        hover:bg-gray-800 rounded">
        <Icon id="plus" color="white" />
        <span class="text-white">New Meeting Time</span>
      </button>
    {:else}
      <div class="flex-0" transition:grow>
        <TimeForm
          on:submit={addTime}
          force={forceTimes}
          on:cancel={toggleRRuleForm} />
      </div>
    {/if}
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
      bind:checked={current.is_private} />
    This meetup is invite-only
  </label>
  <p class="text-sm ml-5 mb-4 text-gray-600 italic">
    Checking this will {initial.name ? 'remove the meetup from' : 'keep the meetup off'} the map
  </p>

  <label class="mt-4 inline-block w-full flex items-center" for="organizer">
    <input
      type="checkbox"
      id="organizer"
      disabled
      checked
      class="-mt-px mr-2" />
    I am the organizer of this meetup
  </label>
  <p class="text-sm ml-5 mb-4 text-gray-600 italic">
    {#if !initial.name}
      For now, only organizers should add meetups. If you're not this meetup's
      organizer, please ask him or her to add it to BadukClub.
    {/if}
  </p>

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
      class="my-4 px-4 py-2 bg-gray-800 rounded text-white">
      Submit
    </button>
  </div>
</div>
