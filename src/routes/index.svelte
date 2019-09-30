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
  import Icon from '/components/Icon'
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
    options: { keys: ['name', 'address'] },
    placeholder: 'Search all public meetups by name or location',
    itemProps: {
      border: true,
      showTime: true,
    },
  }

  const userProps = {
    component: UserCard,
    types: { singular: 'Player', plural: 'Players' },
    items: users,
    click: ({ id }) => `users/${id}`,
    options: { keys: ['name'] },
    placeholder: 'Search all players by name',
    itemProps: {
      border: true,
    },
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

  ul > li {
    @apply my-4;
  }

  ul > li em {
    @apply font-medium not-italic;
  }
</style>

<svelte:head>
  <title>{user ? 'Directory | BadukClub' : 'Welcome to BadukClub'}</title>
  <meta
    property="og:title"
    content={user ? 'Directory | BadukClub' : 'Welcome to BadukClub'} />
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
      Find meetups, tournaments, and new friends on BadukClub
    </p>
    <div class="py-10">
      <a href="map" rel="prefetch" class="button w-full md:w-1/2 lg:w-1/3">
        Explore the Map
      </a>
    </div>
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
      <p class="text-xl">Go Players</p>
    </div>
  </div>

  <hr />
  <div class="py-10 text-center mx-2 md:mx-10 lg:mx-20">
    <h2 class="text-5xl font-medium">Organizing a club is tough</h2>
    <h2 class="text-5xl font-medium mb-8">We make it easier</h2>
    <ul
      class="text-lg lg:text-2xl font-light flex flex-col justify-center
      items-center">
      <li>Show the world your meetups and one-time events (tournaments)</li>
      <Icon id="circle" fill="#262621" />
      <li>Add, edit, and delete information with your own account</li>
      <Icon id="circle" fill="white" />
      <li>Easily invite others to your event with a shareable link</li>
    </ul>
    <div class="py-10">
      <a href="login?redir=/map" class="button w-full md:w-1/2 lg:w-1/3">
        Add your Meetup
      </a>
    </div>
  </div>

  <div class="py-10 text-center mx-2 md:mx-10 lg:mx-28">
    <h2 class="text-5xl font-medium">Playing in person is awesome</h2>
    <h2 class="text-5xl font-medium mb-8">We make it even better</h2>
    <ul
      class="text-lg lg:text-2xl font-light flex flex-col justify-center
      items-center">
      <li>
        <em>Never attend an inactive meetup again!</em>
        See when it was last updated
      </li>
      <Icon id="circle" fill="#262621" />
      <li>Track your casual and tournament games</li>
      <Icon id="circle" fill="white" />
      <li>Invite friends to join you at the event</li>
    </ul>
    <div class="py-10">
      <a href="login?redir=/map" class="button w-full md:w-1/2 lg:w-1/3">
        Find a Meetup
      </a>
    </div>
  </div>
  <hr />

  <div class="py-10 text-center">
    <h2 class="text-5xl font-bold pb-10">Join the Club Today!</h2>
    <a href="login" class="button w-full md:w-1/2 lg:w-1/4">Sign Up Now</a>
  </div>
{/if}
