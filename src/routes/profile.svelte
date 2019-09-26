<script context="module">
  import { execute, update } from '/api/db/index'
  import { profileData } from '/api/db/helpers'
  export async function preload({ query: { tab } }, { user }) {
    if (!user) return this.redirect(302, 'login?redir=/profile')
    const { id, email, token, email_verified } = user
    const {
      games,
      users: [{ attendances, events, ...u }],
    } = await execute({ query: profileData(id), token }, this.fetch)
    return {
      user: { id, email, token, email_verified, ...u },
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
  import UserLocationForm from '/components/forms/UserLocation'
  import NewEventForm from '/components/forms/NewEvent'
  import Sidebar from '/components/layout/Sidebar'
  import Icon from '/components/Icon'
  import Modal from '/components/Modal'
  import { toastKey } from '/utils/index'
  import { getContext } from 'svelte'
  export let user, games, events, currentTab

  let tabs = {
    statistics: { icon: 'go-pieces', label: 'Statistics' },
    attendances: { icon: 'calendar', label: 'Attendances', qty: events.length },
    settings: { icon: 'settings', label: 'Settings' },
  }

  const { ping } = getContext(toastKey)

  let showEventForm = false
  const toggleEventForm = () => (showEventForm ^= true)

  const attendancesProps = {
    component: EventCard,
    types: { singular: 'Meetup', plural: 'Meetups' },
    placeholder: "Search all the meetups you've attended",
    add: user.email_verified ? toggleEventForm : null,
    click: ({ id }) => `events/${id}`,
    options: { keys: ['name'] },
    items: events,
  }

  const gamesProps = {
    component: GameCard,
    types: { singular: 'Games', plural: 'Games' },
    placeholder: "Search all games you've played by opponent name...",
    options: { keys: ['black.name', 'white.name'] },
    items: games.map(({ black_player, white_player, ...g }) => ({
      black: black_player,
      white: white_player,
      ...g,
    })),
  }

  let initial = {
    picture: user.picture,
    phone: user.phone,
    name: user.name,
    rank: user.rank,
  }

  let initialLocation = {
    location: { geolocation: user.geolocation, address: user.address },
    show_location: user.show_location,
  }

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

  function editUserLocation({ detail: { data } }) {
    execute({
      query: update('users', {
        filters: { where: { id: { _eq: user.id } } },
        values: { ...data, last_updated: 'now()' },
        fields: ['geolocation', 'address', 'show_location'],
      }),
      token: user.token,
    }).then(({ update_users: { returning: [u] } }) => {
      user = { ...user, ...u }
      initialLocation = {
        location: { geolocation: u.geolocation, address: u.address },
        show_location: u.show_location,
      }
      ping({
        message: 'Personal location updated successfully',
        type: 'success',
      })
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

<svelte:head>
  <title>Your Profile | BadukClub</title>
</svelte:head>

<Sidebar>
  <div class="flex flex-col items-center">
    <img src={user.picture} alt={user.name} class="w-24 h-24 rounded-full" />
    <h4 class="text-2xl font-semibold my-6 text-center">{user.name}</h4>
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
  <h1 class="text-3xl font-semibold md:text-5xl md:font-black">Your Games</h1>
  <ItemList {...gamesProps} />
{:else if currentTab === 'attendances'}
  <h1 class="text-2xl font-semibold md:text-5xl md:font-black">
    Meetups You're Attending
  </h1>
  <ItemList {...attendancesProps} />
  {#if showEventForm}
    <Modal on:close={toggleEventForm}>
      <NewEventForm on:cancel={toggleEventForm} />
    </Modal>
  {/if}
{:else}
  <div class="bg-white rounded shadow-xl p-4">
    <UserForm
      {initial}
      on:submit={editUser}
      on:cancel={() => (currentTab = 'statistics')} />
  </div>
  <div class="bg-white rounded shadow-xl p-4 mt-8">
    <UserLocationForm initial={initialLocation} on:submit={editUserLocation} />
  </div>
{/if}
