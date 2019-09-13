<script>
  import TimeForm from '/components/forms/RecurrenceRule'
  import Icon from '/components/Icon'
  import { toString } from '/utils/rrule'
  let times = []

  const remove = i => (times = times.slice(0, i).concat(times.slice(i + 1)))
  const addTime = ({ detail: { time } }) => (times = [...times, time])
</script>

{#each times as time, i}
  <div class="flex items-center text-xl">
    <span class="mr-4">{toString(time, !time.rrule)}</span>
    <button
      data-cy="remove-time"
      class="opacity-50 hover:opacity-100"
      on:click={() => remove(i)}>
      <Icon id="x" />
    </button>
  </div>
{/each}

<TimeForm on:submit={addTime} />
