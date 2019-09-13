<script>
  import { tick, createEventDispatcher } from 'svelte'
  import Segments from '/components/Segments'
  import * as utils from '/utils/rrule'

  const dispatch = createEventDispatcher()
  // clones from defaults instead of binding the same reference and having
  // it modified when the boxes are checked
  const changeGroup = async group => {
    const selected = defaults[group]
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

  export let initial = { ...defaults.weekly, freq: 'weekly' }
  let { positions, start, end } = defaults.weekly
  let freq = initial.freq

  $: disabled = !(
    start.time &&
    end.time &&
    (freq !== 'once' || (start.date && end.date)) &&
    utils.utcTimestamp(start.date, start.time) <
      utils.utcTimestamp(end.date, end.time)
  )
  let force = false

  const shouldShow = (n, pos) => !!pos.find(p => p.startsWith(n))

  const setGroup = ({ detail: { choice } }) => (freq = choice)

  $: changeGroup(freq)
  $: preview = utils.toString(toDB({ positions, start, end, freq }))

  function toDB({ start, end, freq, positions }) {
    return {
      start: utils.utcTimestamp(start.date, start.time),
      end: utils.utcTimestamp(end.date, end.time),
      ...(positions.length
        ? { rrule: utils.toRRuleString(freq, positions) }
        : {}),
    }
  }

  function submit() {
    dispatch('submit', { time: toDB({ positions, start, end, freq }) })
    changeGroup(freq)
  }
</script>

<style>
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
</style>

<div class="text-xl opacity-50 relative">
  <span class="absolute italic right-0">Preview</span>
  <span data-cy="preview">{preview || 'Invalid Meeting Time'}</span>
</div>

<hr class="my-4" />

<form class="inline-flex flex-col" on:submit|preventDefault={submit}>
  <span>We're meeting...</span>
  {#if !force}
    <div class="mt-2 mb-4">
      <Segments
        choices={Object.keys(defaults)}
        on:change={setGroup}
        initial={freq} />
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
        <span>starting at</span>
        <input type="time" data-cy="start-time" bind:value={start.time} />
      </div>
      <div class="w-full flex justify-between items-baseline my-4">
        <span>and ending at</span>
        <input type="time" data-cy="end-time" bind:value={end.time} />
      </div>
    {/if}
    <input
      type="submit"
      {disabled}
      data-cy="add-time"
      value="Add Meeting Time"
      class="w-full mx-auto my-4 {disabled ? 'opacity-25 cursor-not-allowed' : ''}
      px-4 py-2 bg-gray-800 rounded text-white flex justify-center" />
  </div>
</form>
