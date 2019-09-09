<script>
  import UserCard from '/components/item/UserCard'

  let base = { name: 'Derek', rank: -25, id: 1 }
  let markerCard = {
    ...base,
    address: '15198 Hook Hollow Road, Novelty, OH USA',
    bio: "Give me a call before you come, I'm usually around. 4406224096",
    last_updated: '2019-09-09T05:30:00.000Z',
  }

  let attendanceCard = {
    ...base,
    isOrganizer: true,
    attendance: {
      confirmed: true,
      paid: true,
      checked_in: false,
    },
  }
</script>

<div class="my-8" data-cy="base-card">
  <UserCard {...base} />
</div>
<div class="my-8" data-cy="marker-card">
  <UserCard {...markerCard} />
</div>
<div class="my-8" data-cy="attendance-card">
  <UserCard {...attendanceCard} />
</div>
