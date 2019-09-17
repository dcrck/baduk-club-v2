<script context="module">
  import { execute, update } from '/api/db/index'
  import { profileData } from '/api/db/helpers'
  export async function preload({ params: { tab } }, { user }) {
    if (!user) return this.redirect(302, 'login?redir=profile')
    const { id, email, token } = user
    const {
      games,
      users: [{ attendances, events, ...u }],
    } = await execute({ query: profileData(id), token }, this.fetch)
    return {
      user: { id, email, token, ...u },
      games,
      events: events.concat(
        attendances.map(a => a.event).filter(e => e.organizer_id !== id)
      ),
      currentTab: tab || 'statistics',
    }
  }
</script>

<script>
  import EventCard from '/components/item/EventCard'
  import GameCard from '/components/item/GameCard'
  import ItemList from '/components/item/List'
  import UserForm from '/components/forms/User'
  import Sidebar from '/components/layout/Sidebar'
  import Icon from '/components/Icon'
  import { toastKey } from '/utils/index'
  import { getContext } from 'svelte'
  export let user, games, events, currentTab

  let tabs = {
    statistics: { icon: 'go-pieces', label: 'Statistics' },
    attendances: { icon: 'calendar', label: 'Attendances', qty: events.length },
    settings: { icon: 'settings', label: 'Settings' },
  }

  const { ping } = getContext(toastKey)

  const attendancesProps = {
    component: EventCard,
    types: { singular: 'Meetup', plural: 'Meetups' },
    placeholder: "Search all the events you've attended",
    options: { keys: ['name'] },
    items: events,
  }

  const gamesProps = {
    component: GameCard,
    types: { singular: 'Games', plural: 'Games' },
    placeholder: "Search all games you've played by opponent",
    options: { keys: ['black.name', 'white.name'] },
    items: games.map(({ black_player, white_player, ...g }) => ({
      black: black_player,
      white: white_player,
      ...g,
    })),
  }

  let initial = { picture: user.picture, phone: user.phone, name: user.name }

  function editUser({ detail: { data } }) {
    execute({
      token: user.token,
      query: update('users', {
        filters: { where: { id: { _eq: user.id } } },
        values: data,
      }),
    }).then(() => {
      user = { ...user, ...data }
      initial = { ...initial, ...data }
      ping({ message: 'Profile updated successfully', type: 'success' })
    })
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
  <ItemList {...gamesProps} />
{:else if currentTab === 'attendances'}
  <ItemList {...attendancesProps} />
{:else}
  <div class="bg-white rounded shadow-xl p-8">
    <UserForm {initial} on:submit={editUser} />
  </div>
{/if}
