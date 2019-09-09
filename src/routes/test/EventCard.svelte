<script>
  import EventCard from '/components/item/EventCard'

  let base = {
    name: 'Test Event Name',
    id: 1,
    address: '15198 Hook Hollow Road, Novelty, OH USA',
    times: [
      {
        start: '2019-04-01T19:00:00.000Z',
        end: '2019-04-01T21:00:00.000Z',
        rrule: 'FREQ=WEEKLY;BYDAY=MO',
      },
    ],
  }

  let expanded = {
    ...base,
    expanded: true,
    description: 'This is a test description\nwith newlines.',
  }

  let showTime = {
    ...base,
    showTime: true,
    last_updated: '2019-09-09T05:30:00.000Z',
  }
</script>

<div class="my-8" data-cy="base-card">
  <EventCard {...base} />
</div>
<div class="my-8" data-cy="expanded-card">
  <EventCard {...expanded} />
</div>
<div class="my-8" data-cy="time-card">
  <EventCard {...showTime} />
</div>
