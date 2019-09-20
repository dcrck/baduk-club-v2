<script context="module">
  import { execute } from '/api/db/index'
  import { profileData } from '/api/db/helpers'
  export async function preload({ params: { id } }, { user }) {
    if (user && user.id === id) return this.redirect(302, '/profile')
    const {
      games,
      users: [{ attendances, events, ...u }],
    } = await execute(
      { query: profileData(id), token: user ? user.token : null },
      this.fetch
    )
    return {
      user: { id, ...u },
      games,
      events: events.concat(
        attendances.map(a => a.event).filter(e => e.organizer_id !== id)
      ),
    }
  }
</script>

<script>
  import EventCard from '/components/item/EventCard'
  import GameCard from '/components/item/GameCard'
  import ItemList from '/components/item/List'
  import Sidebar from '/components/layout/Sidebar'
  import Icon from '/components/Icon'
  export let user, games, events

  let currentTab = 'statistics'
  let tabs = {
    statistics: { icon: 'go-pieces', label: 'Statistics' },
    attendances: { icon: 'calendar', label: 'Attendances', qty: events.length },
  }

  const attendancesProps = {
    component: EventCard,
    types: { singular: 'Meetup', plural: 'Meetups' },
    placeholder: `Search all the meetups ${user.name} has attended`,
    click: ({ id }) => `events/${id}`,
    options: { keys: ['name'] },
    items: events,
  }

  const gamesProps = {
    component: GameCard,
    types: { singular: 'Games', plural: 'Games' },
    placeholder: `Search all games ${user.name} has played by opponent name...`,
    options: { keys: ['black.name', 'white.name'] },
    items: games.map(({ black_player, white_player, ...g }) => ({
      black: black_player,
      white: white_player,
      ...g,
    })),
  }
</script>

<style>
  label {
    @apply w-full h-24 p-8 cursor-pointer flex items-center;
  }
  label.current {
    @apply bg-gray-200;
  }
  label:not(.current):hover {
    @apply bg-gray-100;
  }
</style>

<svelte:head>
  <title>{user.name} | BadukClub</title>
</svelte:head>

<Sidebar>
  <div class="flex flex-col items-center">
    <img src={user.picture} alt={user.name} class="w-24 h-24 rounded-full" />
    <h4 class="text-2xl font-semibold my-6">{user.name}</h4>
  </div>
  {#each Object.entries(tabs) as [tab, { icon, label, qty }]}
    <label for={tab} data-cy="{tab}-tab" class:current={currentTab === tab}>
      <input
        type="radio"
        bind:group={currentTab}
        value={tab}
        id={tab}
        class="hidden" />
      <div class="mr-4">
        <Icon id={icon} />
      </div>
      <span>{label}</span>
      {#if qty}
        <span class="bg-gray-300 ml-2 px-4 text-sm rounded-full font-mono">
          {qty}
        </span>
      {/if}
    </label>
  {/each}
</Sidebar>
{#if currentTab === 'statistics'}
  <div class="flex items-center mb-4 md:mb-12">
    <h1 class="text-3xl font-semibold md:text-5xl md:font-black mr-5">
      Statistics
    </h1>
    <span
      class="text-sm rounded-full py-2 px-3 bg-gray-300 uppercase tracking-wider
      font-mono">
      Coming Soon
    </span>
  </div>
  <h1 class="text-3xl font-semibold md:text-5xl md:font-black">
    {user.name}'s Games
  </h1>
  <ItemList {...gamesProps} />
{:else}
  <h1 class="text-2xl font-semibold md:text-5xl md:font-black">
    {user.name}'s Attended Meetups
  </h1>
  <ItemList {...attendancesProps} />
{/if}
