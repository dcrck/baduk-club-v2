<script>
  import { tick, createEventDispatcher } from 'svelte'
  import Segments from '/components/Segments'
  import Icon from '/components/Icon'
  import * as utils from '/utils/rrule'

  const dispatch = createEventDispatcher()
  // clones from defaults instead of binding the same reference and having
  // it modified when the boxes are checked
  const changeGroup = async (group, reset = false) => {
    const selected = reset ? _initial : defaults[group]
    // we also need to wait for the new checkboxes to have rendered
    await tick()
    start = { ...selected.start }
    end = { ...selected.end }
    positions = [...(selected.positions || [])]
  }

  let _start = { time: '17:00' }
  let _end = { time: '19:00' }
  let _date = new Date().toISOString().slice(0, 10)

  const defaults = {
    weekly: { start: _start, end: _end, positions: ['MO'] },
    monthly: { start: _start, end: _end, positions: ['+1MO'] },
    once: { start: { date: _date, ..._start }, end: { date: _date, ..._end } },
  }

  let options = {
    weekly: [{ full: 'on', number: '', days: utils.weekdays }],
    monthly: utils.positions.map(p => ({ ...p, days: utils.weekdays })),
    once: [],
  }

  export let initial = null
  export let force = Object.keys(defaults)

  let fallback = force[0] || 'weekly'
  let _initial = initial
    ? { ...initial }
    : { ...defaults[fallback], freq: fallback }
  let { positions, start, end, freq } = _initial

  const shouldShow = (n, pos) => !!pos.find(p => p.startsWith(n))

  const setGroup = ({ detail: { choice } }) => (freq = choice)

  $: changeGroup(freq)
  $: preview = utils.toString(
    toDB({ positions, start, end, freq }),
    freq === 'once'
  )

  const toDB = ({ start, end, freq, positions }) => ({
    start: utils.utcTimestamp(start.date, start.time),
    end: utils.utcTimestamp(end.date, end.time),
    ...(positions.length
      ? { rrule: utils.toRRuleString(freq, positions) }
      : {}),
  })

  function submit() {
    dispatch('submit', { time: toDB({ positions, start, end, freq }) })
    changeGroup(freq)
  }

  function cancel() {
    dispatch('cancel')
    changeGroup(freq)
  }
  $: disabled = !(
    (freq === 'once' || positions.length) &&
    start.time &&
    end.time &&
    (freq !== 'once' || (start.date && end.date)) &&
    utils.utcTimestamp(start.date, start.time) <
      utils.utcTimestamp(end.date, end.time)
  )
</script>

<style>
  button.disabled {
    @apply opacity-25 cursor-not-allowed;
  }
  .day {
    cursor: pointer;
  }
  .day input + span {
    opacity: 0.5;
  }
  .day input:checked + span {
    opacity: 1;
  }

  input[type='date'],
  input[type='time'] {
    @apply px-2 py-2 border rounded border-gray-400;
  }

  input[type='date']:focus,
  input[type='time']:focus {
    @apply border-gray-800;
  }

  button.form {
    @apply rounded my-4 px-4 py-2 border border-gray-800 flex items-center justify-center;
  }
</style>

<div class="text-xl opacity-50 relative">
  <span class="absolute italic right-0">Preview</span>
  <p data-cy="preview" class="w-10/12">
    {positions.length || freq === 'once' ? preview : 'Please add some days!'}
  </p>
</div>

<hr class="my-4" />

<div class="inline-flex flex-col">
  <span>We're meeting...</span>
  {#if force.length !== 1}
    <div class="mt-2 mb-4">
      <Segments choices={force} on:change={setGroup} initial={freq} />
    </div>
  {/if}

  <div class="flex-1">
    {#if freq === 'once'}
      <span class="w-16 mt-4">From:</span>
      <div class="mb-4">
        <input type="date" data-cy="start-date" bind:value={start.date} />
        <input type="time" data-cy="start-time" bind:value={start.time} />
      </div>
      <span class="w-16 mt-4">Until:</span>
      <div class="mb-4">
        <input type="date" data-cy="end-date" bind:value={end.date} />
        <input type="time" data-cy="end-time" bind:value={end.time} />
      </div>
    {:else}
      {#if freq === 'monthly'}
        <span>on the...</span>
      {/if}
      {#each options[freq] as { number, days, full }}
        <div class="flex">
          <span
            class="{shouldShow(number, positions) ? 'opacity-100' : 'opacity-50'}
            w-16 inline-block">
            {full}
          </span>
          <div class="flex justify-between flex-grow">
            {#each days as { one, two }}
              <label class="day" data-cy={number + two}>
                <input
                  type="checkbox"
                  bind:group={positions}
                  class="hidden"
                  value={number + two} />
                <span>{one}</span>
              </label>
            {/each}
          </div>
        </div>
      {/each}
      <div class="w-full flex justify-between items-baseline my-4">
        <span class="mr-2">starting at</span>
        <input type="time" data-cy="start-time" bind:value={start.time} />
      </div>
      <div class="w-full flex justify-between items-baseline my-4">
        <span class="mr-2">and ending at</span>
        <input type="time" data-cy="end-time" bind:value={end.time} />
      </div>
    {/if}
    <div class="w-full flex items-center justify-between">
      <button data-cy="cancel-time" on:click={cancel} class="form bg-white">
        <div class="mr-2">
          <Icon id="x" />
        </div>
        <span>Cancel</span>
      </button>
      <button
        {disabled}
        data-cy="add-time"
        on:click={submit}
        class="form bg-gray-800 text-white"
        class:disabled>
        <div class="mr-2">
          <Icon id="check" color="white" />
        </div>
        <span>Confirm</span>
      </button>
    </div>
  </div>
</div>
