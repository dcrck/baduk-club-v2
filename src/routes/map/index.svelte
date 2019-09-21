<script context="module">
  import { select, execute } from '/api/db/index'

  export async function preload({ query: { bounds, code } }, { user }) {
    const eventQuery = select('events', {
      fields: [
        'address',
        'description',
        'geolocation',
        'id',
        'name',
        'times',
        'last_updated',
      ],
    })
    const { events } = await execute({ query: eventQuery }, this.fetch)
    const parse = x => (typeof x === 'string' ? JSON.parse(x) : x)
    const checkBounds = ([w, s, e, n]) =>
      checkLon(w) && checkLat(s) && checkLon(e) && checkLat(n) && s < n && w < e
        ? [w, s, e, n]
        : undefined
    const checkLat = n => !isNaN(n) && n >= -90 && n <= 90
    const checkLon = n => !isNaN(n) && n >= -180 && n <= 180
    if (bounds) bounds = checkBounds(bounds.split(',').map(n => +n))
    if (code) code = code.length === 3 ? code : undefined

    return {
      user,
      events: events.map(({ geolocation, times, ...e }) => ({
        geolocation: parse(geolocation),
        times: parse(times),
        ...e,
      })),
      bounds,
      code,
    }
  }
</script>

<script>
  import Map from './_components/Map.svelte'
  import Marker from './_components/Marker.svelte'
  import Icon from '/components/Icon'
  import Modal from '/components/Modal'
  import NewEventForm from '/components/forms/NewEvent'
  import EventCard from '/components/item/EventCard'
  import Sidebar from '/components/layout/Sidebar'
  import { fly } from 'svelte/transition'

  export let events = [],
    user = {},
    bounds,
    code

  let options = bounds
    ? { bounds }
    : {
        center: [-84, 35],
        zoom: 3.5,
      }
  let selected
  function toggle(id) {
    if (selected)
      document.getElementById(selected.id).classList.toggle('selected')
    if ((selected && selected.id !== id) || !selected)
      document.getElementById(id).classList.toggle('selected')
    selected =
      selected && selected.id === id
        ? undefined
        : events.find(ev => ev.id === id)
  }

  function hide(e) {
    e.preventDefault()
    toggle(selected.id)
  }

  const toggleEventForm = () => (showNewEventForm ^= true)

  let showSidebar = false
  let showNewEventForm = false
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
      left: 0;
      transform: none;
    }
    .popup:hover {
      left: 0;
      transform: translateY(-10px);
    }
  }
</style>

<svelte:head>
  {#if code}
    <title>Where to Play Go in {code} | BadukClub</title>
    <meta name="keywords" content="go,baduk,meetup,event,weiqi,map,{code}" />
    <meta
      property="og:title"
      content="Where to Play Go in {code} | BadukClub" />
    <meta
      name="description"
      content="Never again wonder where to play Go in {code}! Search the
      definitive map of Go meetups that always stays up-to-date." />
    <meta
      property="og:description"
      content="Never again wonder where to play Go in {code}! Search the
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
        <p class="font-semibold text-lg">{events.length} Meetups</p>
        <p>on the map</p>
      </div>
      <div class="my-8">
        {#if user}
          {#if user.email_verified}
            <button
              data-cy="add-meetup-button"
              class="bg-gray-700 rounded py-3 px-5 hover:bg-gray-800 flex
              mx-auto click"
              on:click={toggleEventForm}>
              <Icon id="map-pin" color="white" />
              <span class="ml-2 text-white font-medium">Add Meetup</span>
            </button>
          {:else}
            <div class="py-3 px-3 text-center">
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
    {#each events as { geolocation, name, id }}
      <Marker
        location={geolocation}
        label={name}
        {id}
        on:click={() => toggle(id)} />
    {/each}
  </Map>
</div>
{#if selected}
  <a
    href="events/{selected.id}"
    rel="prefetch"
    class="fixed z-30 md:w-1/2 hover:shadow-2xl popup"
    transition:fly={{ y: 200, duration: 500 }}>
    <EventCard {...selected} showTime={true} />
    <button
      class="absolute right-0 top-0 p-4 opacity-50 hover:opacity-100"
      on:click={hide}>
      <Icon id="x" size="32" />
    </button>
  </a>
{/if}
{#if showNewEventForm}
  <Modal on:close={toggleEventForm}>
    <NewEventForm on:cancel={toggleEventForm} />
  </Modal>
{/if}
