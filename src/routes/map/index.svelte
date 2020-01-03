<script context="module">
  import { merge, select, execute, update } from '/api/db/index'

  export async function preload({ query: { bounds, code, name } }, { user }) {
    const eventQuery = merge([
      {
        root: 'events',
        fields: [
          'address',
          'description',
          'geolocation',
          'id',
          'name',
          'times',
          'last_updated',
        ],
      },
      {
        root: 'users',
        filters: { where: { show_location: { _eq: true } } },
        fields: [
          'id',
          'name',
          'geolocation',
          'show_location',
          'last_updated',
          'name',
          'rank',
          'picture',
        ],
      },
    ])

    const gql = q => execute({ query: q }, this.fetch)

    let { events, users } = await gql(eventQuery)
    if (user) {
      const currentUserQuery = select('users', {
        filters: { where: { id: { _eq: user.id } } },
        fields: [
          'id',
          'name',
          'address',
          'geolocation',
          'show_location',
          'last_updated',
          'name',
          'rank',
          'picture',
        ],
      })
      let {
        users: [current],
      } = await gql(currentUserQuery)
      users = [...users.filter(u => u.id !== user.id), current]
    }
    const parse = x => (typeof x === 'string' ? JSON.parse(x) : x)
    const checkBounds = ([w, s, e, n]) =>
      checkLon(w) && checkLat(s) && checkLon(e) && checkLat(n) && s < n && w < e
        ? [w, s, e, n]
        : undefined
    const checkLat = n => !isNaN(n) && n >= -90 && n <= 90
    const checkLon = n => !isNaN(n) && n >= -180 && n <= 180
    const addArticle = name =>
      name.includes('Islands') ||
      name.includes('Republic') ||
      name.includes('States') ||
      name.includes('Kingdom')
        ? 'the ' + name
        : name
    if (bounds) bounds = checkBounds(bounds.split(',').map(n => +n))
    if (code) code = code.length === 3 ? code : undefined
    if (name) name = addArticle(decodeURIComponent(name))

    return {
      user,
      markers: events
        .map(({ geolocation, times, ...e }) => ({
          geolocation: parse(geolocation),
          times: parse(times),
          ...e,
          type: 'event',
        }))
        .concat(
          users.map(({ geolocation, ...u }) => ({
            geolocation: parse(geolocation),
            ...u,
            type: 'user',
          }))
        ),
      bounds,
      code,
      name,
    }
  }
</script>

<script>
  import Map from './_components/Map.svelte'
  import Marker from './_components/Marker.svelte'
  import Icon from '/components/Icon'
  import Modal from '/components/Modal'
  import NewEventForm from '/components/forms/NewEvent'
  import UserLocationForm from '/components/forms/UserLocation'
  import EventCard from '/components/item/EventCard'
  import UserCard from '/components/item/UserCard'
  import Sidebar from '/components/layout/Sidebar'
  import { fly } from 'svelte/transition'
  import { toastKey } from '/utils/index'
  import { getContext } from 'svelte'

  export let markers = [],
    user = {},
    bounds,
    code,
    name

  let options = bounds
    ? { bounds }
    : {
        center: [-84, 35],
        zoom: 3.5,
      }
  let selected, selectedEmail, selectedType

  const { ping } = getContext(toastKey)

  const fetchUserEmail = id =>
    execute({
      query: select('auth0', { filters: { id }, fields: 'email' }),
    }).then(({ auth0 }) => auth0.email)

  function getCurrentUserLocation(user) {
    if (!user.id) return null
    const u = markers.find(u => u.id === user.id)
    if (!u)
      return {
        location: { address: '', geolocation: null },
        show_location: false,
      }
    const { geolocation, address, show_location } = u
    return { location: { geolocation, address }, show_location }
  }

  function editUserLocation({ detail: { data } }) {
    execute({
      query: update('users', {
        filters: { where: { id: { _eq: user.id } } },
        values: { ...data, last_updated: 'now()' },
        fields: [
          'id',
          'name',
          'address',
          'geolocation',
          'last_updated',
          'name',
          'rank',
          'picture',
          'show_location',
        ],
      }),
      token: user.token,
    }).then(({ update_users: { returning: [u] } }) => {
      toggleLocationForm()
      if (selected && u.id === selected.id) toggle(u.id)
      markers = [
        ...markers.filter(m => m.id !== user.id),
        { ...u, type: 'user' },
      ]
      ping({
        message: 'Personal location updated successfully',
        type: 'success',
      })
    })
  }

  async function toggle(id) {
    if (selected)
      document.getElementById(selected.id).classList.toggle('selected')
    if ((selected && selected.id !== id) || !selected)
      document.getElementById(id).classList.toggle('selected')
    let { type, ...rest } =
      selected && selected.id === id
        ? { type: '' }
        : markers.find(m => m.id === id)

    selected = Object.keys(rest).length ? rest : null
    selectedType = type

    selectedEmail =
      type === 'user' && selected ? await fetchUserEmail(selected.id) : null
  }

  function hide(e) {
    e.preventDefault()
    toggle(selected.id)
  }

  const toggleEventForm = () => (showNewEventForm ^= true)
  const toggleLocationForm = () => (showUserLocationForm ^= true)

  let showSidebar = false
  let showNewEventForm = false
  let showUserLocationForm = false
</script>

<style>
  .popup {
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    transition: 0.2s;
  }

  .popup:hover {
    transform: translate(-50%, -10px);
  }

  .map {
    top: 4rem;
    height: calc(100vh - 4rem);
  }

  .click {
    position: relative;
    box-shadow: 0 3px 6px -2px rgba(0, 0, 0, 0.5);
    top: 0;
    transition: 0.1s;
  }

  .click:active {
    top: 3px;
    box-shadow: none;
  }

  @media screen and (max-width: 640px) {
    .popup {
      @apply mx-1 left-0;
      top: 4.25rem;
      transform: none;
      bottom: auto;
    }
    .popup.nouser {
      top: 6rem;
    }
    .popup:hover {
      left: 0;
      transform: none;
    }
  }
</style>

<svelte:head>
  {#if code}
    <title>Where to Play Go in {name} | BadukClub</title>
    <meta name="keywords" content="go,baduk,meetup,event,weiqi,map,{code},{name}" />
    <meta
      property="og:title"
      content="Where to Play Go in {name} | BadukClub" />
    <meta property="og:image" content="{process.env.APP_DOMAIN}/countries/{code}.png" >
    <meta
      name="description"
      content="Never again wonder where to play Go in {name}! Search the
      definitive map of Go meetups that always stays up-to-date." />
    <meta
      property="og:description"
      content="Never again wonder where to play Go in {name}! Search the
      definitive map of Go meetups that always stays up-to-date." />
  {:else}
    <title>Where to Play Go | BadukClub</title>
    <meta property="og:title" content="Where to Play Go | BadukClub" />
    <meta
      name="description"
      content="Never again wonder where to play Go! Search the definitive map of
      Go meetups that always stays up-to-date." />
    <meta
      property="og:description"
      content="Never again wonder where to play Go! Search the definitive map of
      Go meetups that always stays up-to-date." />
  {/if}
</svelte:head>

{#if showSidebar}
  <div class="fixed left-0 z-50 top-0" transition:fly={{ x: -200 }}>
    <Sidebar>
      <div class="text-center">
        <p>There are</p>
        <p class="font-semibold text-lg">
          {markers.filter(m => m.type === 'event').length} Meetups
        </p>
        <p>and</p>
        <p class="font-semibold text-lg">
          {markers.filter(m => m.show_location).length} Go Players
        </p>
        <p>on the map</p>
      </div>
      <div class="my-4">
        {#if user}
          {#if user.email_verified}
            <button
              data-cy="add-meetup-button"
              class="bg-gray-700 rounded py-3 px-5 hover:bg-gray-800 flex
              mx-auto click my-4"
              on:click={toggleEventForm}>
              <Icon id="map-pin" color="white" />
              <span class="ml-2 text-white font-medium">Add Meetup</span>
            </button>
            <button
              data-cy="add-user-location-button"
              class="bg-white rounded py-3 px-5 hover:bg-gray-200 flex mx-auto
              click border-2 border-gray-700 my-4"
              on:click={toggleLocationForm}>
              <Icon id="user-plus" />
              <span class="ml-2 font-medium">Add Yourself</span>
            </button>
          {:else}
            <div class="py-3 px-3 text-center bg-gray-300">
              Please verify your email address to create meetups
            </div>
          {/if}
        {:else}
          <a
            href="login?redir=/map"
            class="bg-gray-700 rounded py-3 px-5 hover:bg-gray-800 flex
            justify-center items-center mx-2 click">
            <Icon id="map-pin" color="white" />
            <span class="ml-2 text-white font-medium">Add your Meetup</span>
          </a>
        {/if}
      </div>
    </Sidebar>
  </div>
{/if}

<div class="fixed w-screen left-0 map">
  <Map {options} on:ready={() => (showSidebar = true)}>
    {#each markers.filter(m => m.show_location || m.type === 'event') as { geolocation, name, id, type }}
      <Marker
        location={geolocation}
        label={name}
        color={type === 'event' ? '#262621' : 'white'}
        {id}
        on:click={() => toggle(id)} />
    {/each}
  </Map>
</div>
{#if selected}
  <a
    href={selectedType === 'event' ? `events/${selected.id}` : `users/${selected.id}`}
    rel="prefetch"
    class:nouser={!user}
    class="fixed z-30 md:w-1/2 hover:shadow-2xl popup"
    transition:fly={{ y: 200, duration: 500 }}>
    {#if selectedType === 'event'}
      <EventCard {...selected} showTime={true} clickable />
    {:else}
      <UserCard {...selected} email={selectedEmail} />
    {/if}
    <button
      class="absolute right-0 top-0 p-2 opacity-50 hover:opacity-100"
      on:click={hide}>
      <Icon id="x" />
    </button>
  </a>
{/if}
{#if showNewEventForm}
  <Modal on:close={toggleEventForm}>
    <NewEventForm on:cancel={toggleEventForm} />
  </Modal>
{/if}
{#if showUserLocationForm}
  <Modal on:close={toggleLocationForm}>
    <p class="text-xl font-medium mb-4">
      No club near you? Open to games outside of a meetup?
    </p>
    <UserLocationForm
      initial={getCurrentUserLocation(user)}
      on:submit={editUserLocation}
      on:cancel={toggleLocationForm} />
  </Modal>
{/if}
