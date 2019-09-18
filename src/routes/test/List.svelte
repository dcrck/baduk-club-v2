<script>
  import ItemList from '/components/item/List'
  import GameCard from '/components/item/GameCard'
  import UserCard from '/components/item/UserCard'
  import EventCard from '/components/item/EventCard'

  let userListProps = {
    component: UserCard,
    types: { singular: 'User', plural: 'Users' },
    placeholder: 'Search Users...',
    options: { keys: ['name'] },
    items: [
      {
        name: 'Derek',
        rank: -25,
        id: '123',
      },
      {
        name: 'Rachel',
        rank: -25,
        id: '123',
        address: '15198 Hook Hollow Road, Novelty, OH USA',
        bio: "Give me a call before you come, I'm usually around. 4406224096",
        last_updated: '2019-09-09T05:30:00.000Z',
      },
      {
        name: 'Devin',
        rank: -25,
        id: '123',
        isOrganizer: true,
        attendance: {
          confirmed: true,
          paid: true,
          checked_in: false,
        },
      },
    ],
  }

  let gameListProps = {
    component: GameCard,
    types: { singular: 'Game', plural: 'Games' },
    placeholder: 'Search Games...',
    options: { keys: ['black.name', 'white.name'] },
    items: [
      {
        black: { name: 'Derek' },
        white: { name: 'Devin' },
        winner: true,
        komi: 15,
        handicap: 22,
      },
      {
        black: { name: 'Rachel' },
        white: { name: 'Kyle' },
        winner: false,
        komi: 0,
        handicap: 10,
        event: {
          name: 'Go Event Name',
          id: '1',
        },
      },
    ],
  }

  let eventListProps = {
    component: EventCard,
    types: { singular: 'Event', plural: 'Events' },
    placeholder: 'Search Events...',
    options: { keys: ['name', 'address'] },
    click: ({ id }) => `events/${id}`,
    items: [
      {
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
      },
      {
        name: 'Other Go Club',
        id: 2,
        address: '15198 Main St, Columbus, OH USA',
        times: [
          {
            start: '2019-04-01T19:00:00.000Z',
            end: '2019-04-01T21:00:00.000Z',
            rrule: 'FREQ=WEEKLY;BYDAY=MO',
          },
        ],
      },
    ],
  }
</script>

<div data-cy="user-list">
  <ItemList {...userListProps} />
</div>

<div data-cy="game-list">
  <ItemList {...gameListProps} />
</div>
<div data-cy="event-list">
  <ItemList {...eventListProps} />
</div>
