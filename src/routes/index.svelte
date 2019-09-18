<script context="module">
  import { merge, execute } from '/api/db/index'

  export async function preload(page, { user }) {
    const activityQuery = merge([
      {
        root: 'events',
        fields: ['id', 'last_updated', 'name', 'times', 'address'],
      },
      { root: 'users', fields: ['id', 'name', 'rank', 'picture'] },
    ])

    const { events, users } = await execute(
      { query: activityQuery, token: user ? user.token : undefined },
      this.fetch
    )
    const parse = x => (typeof x === 'string' ? JSON.parse(x) : x)
    return {
      events: events.map(({ times, ...e }) => ({
        times: parse(times),
        ...e,
      })),
      users,
      user,
    }
  }
</script>

<script>
  import { onMount } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import Segments from '/components/Segments'
  import UserCard from '/components/item/UserCard'
  import EventCard from '/components/item/EventCard'
  import ItemList from '/components/item/List'
  import NewEventForm from '/components/forms/NewEvent'
  import Modal from '/components/Modal'
  export let users, events

  export let user
  const activity = tweened(
    { events: 0, users: 0 },
    { duration: 1000, easing: cubicOut }
  )

  let list = 'meetups'
  let lists = [
    { icon: 'calendar', name: 'meetups' },
    { icon: 'users', name: 'players' },
  ]

  let showEventForm = false
  const toggleEventForm = () => (showEventForm ^= true)

  const meetupProps = {
    component: EventCard,
    types: { singular: 'Meetup', plural: 'Meetups' },
    items: events,
    add: user && user.email_verified ? toggleEventForm : null,
    click: ({ id }) => `events/${id}`,
    options: { keys: ['name'] },
    placeholder: 'Search all public meetups...',
    border: true,
  }

  const userProps = {
    component: UserCard,
    types: { singular: 'Player', plural: 'Players' },
    items: users,
    options: { keys: ['name'] },
    placeholder: 'Search all players by name...',
    border: true,
  }

  const switchList = ({ detail: { choice } }) => (list = choice)

  onMount(() => activity.set({ users: users.length, events: events.length }))
</script>

<style>
  a.button {
    @apply block mx-auto py-4 px-4 bg-gray-700 rounded text-white text-lg font-semibold;
  }

  a.button:hover {
    @apply bg-gray-800;
  }
</style>

<svelte:head>
  <title>{user ? 'Directory | BadukClub' : 'Welcome to BadukClub'}</title>
</svelte:head>

{#if user}
  <h1 class="text-5xl font-black mb-8" data-cy="directory-header">Directory</h1>
  <div class="my-8">
    <Segments initial={list} choices={lists} on:change={switchList} />
  </div>

  {#if list === 'meetups'}
    <ItemList {...meetupProps} />
    {#if showEventForm}
      <Modal on:close={toggleEventForm}>
        <NewEventForm on:cancel={toggleEventForm} />
      </Modal>
    {/if}
  {:else if list === 'players'}
    <ItemList {...userProps} />
  {/if}
{:else}
  <div class="text-center" data-cy="home-intro-text">
    <h1 class="font-bold text-6xl">The one-stop shop</h1>
    <h1 class="font-bold text-6xl">for in-person Go</h1>
    <p class="text-2xl py-10">
      Find local Go meetups, tournaments, and players on BadukClub
    </p>
  </div>

  <div class="py-10 text-center">
    <a href="login" class="button w-full md:w-1/2 lg:w-1/4">Sign Up Now</a>
  </div>

  <div class="py-10 flex justify-around text-center">
    <div class="flex flex-col justify-center">
      <h1
        class="font-semibold"
        style="font-size: 4.5rem"
        data-cy="meetup-count">
        {Math.round($activity.events)}
      </h1>
      <p class="text-xl">Meetups</p>
    </div>
    <div class="flex flex-col justify-center">
      <h1 class="font-semibold" style="font-size: 4.5rem" data-cy="user-count">
        {Math.round($activity.users)}
      </h1>
      <p class="text-xl">Users</p>
    </div>
  </div>

  <hr />
  <div class="py-10 text-center mx-2 md:mx-10 lg:mx-32">
    <h2 class="text-5xl font-semibold">Up-to-date Meetups</h2>
    <p class="text-xl">
      We perform quality checks frequently to ensure our regular meetups are
      still active, so you don’t have to worry about outdated information when
      you show up to an event
    </p>
    <div class="py-10">
      <a href="map" class="button w-full md:w-1/2 lg:w-1/3">Explore Meetups</a>
    </div>
  </div>

  <div class="py-10 text-center mx-2 md:mx-10 lg:mx-32">
    <h2 class="text-5xl font-semibold">Casual Game Tracking</h2>
    <p class="text-xl">
      Each meetup lets you track game results, so you can record your casual
      games and get a feeling for how you're progressing
    </p>
  </div>
  <hr />

  <div class="py-10 text-center">
    <h2 class="text-5xl font-bold pb-10">Join the Club Today!</h2>
    <a href="login" class="button w-full md:w-1/2 lg:w-1/4">Sign Up Now</a>
  </div>
{/if}
