<script context="module">
  import { merge, select, execute, create, del, update } from '/api/db/index'
  export async function preload({ params: { id } }, { user }) {
    const gql = q =>
      execute({ query: q, token: user ? user.token : '' }, this.fetch)

    const { events } = await gql(
      select('events', {
        filters: { where: { id: { _eq: id } }, limit: 1 },
        fields: {
          _: [
            'id',
            'geolocation',
            'name',
            'address',
            'description',
            'times',
            'last_updated',
          ],
          organizer: ['name', 'id', 'picture', 'rank'],
          ...(user
            ? {
                games: {
                  _: ['winner', 'komi', 'handicap', 'id', 'recorded'],
                  black_player: ['id', 'name'],
                  white_player: ['id', 'name'],
                },
                attendances: {
                  _: ['email', 'confirmed', 'id'],
                  user: ['id', 'name', 'rank', 'picture'],
                },
              }
            : {}),
        },
      })
    )
    if (!events.length) return this.error(404, 'This event does not exist')
    const [
      {
        times,
        geolocation,
        description,
        organizer,
        games,
        attendances,
        ...evt
      },
    ] = events
    const uid = user ? user.id : ''
    const parse = x => (typeof x === 'string' ? JSON.parse(x) : x)
    const loadOrganizerDetails = () =>
      gql(
        select('auth0', { filters: { id: organizer.id }, fields: ['email'] })
      ).then(({ auth0 }) => auth0.email)

    const isOrganizer = id => id === organizer.id

    return {
      evt: {
        times: parse(times),
        geolocation: parse(geolocation),
        description: decodeURIComponent(description),
        ...evt,
      },
      isOrganizer,
      userIsOrganizer: isOrganizer(uid),
      canCheckIn: false,
      existingAttendance: attendances
        ? attendances.find(a => a.user.id === uid)
        : null,
      user,
      games: games
        ? games.map(({ black_player, white_player, ...game }) => ({
            black: black_player,
            white: white_player,
            ...game,
          }))
        : [],
      attendances,
      delayedActions: loadOrganizerDetails,
    }
  }
</script>

<script>
  import EventCard from '/components/item/EventCard'
  import ItemList from '/components/item/List'
  import UserCard from '/components/item/UserCard'
  import GameCard from '/components/item/GameCard'
  import GameForm from '/components/forms/Game'
  import Sidebar from '/components/layout/Sidebar'
  import EventForm from '/components/forms/Event'
  import Icon from '/components/Icon'
  import Modal from '/components/Modal'
  import { onMount, getContext } from 'svelte'
  import { toastKey } from '/utils/index'
  import { newAttendance } from '/api/db/helpers'
  import { goto } from '@sapper/app'
  import nanoid from 'nanoid'
  export let evt,
    user,
    existingAttendance,
    canCheckIn,
    isOrganizer,
    userIsOrganizer,
    delayedActions
  export let attendances = []
  export let games = []

  let orgEmail = ''
  const { ping } = getContext(toastKey)
  let codeLoader = loadInviteCode(existingAttendance)

  onMount(async () => (orgEmail = await delayedActions()))

  async function loadInviteCode(attending) {
    if (!attending) return Promise.resolve('')
    return await execute({
      token: user.token,
      query: select('invites', {
        filters: { where: { event_id: { _eq: evt.id } }, limit: 1 },
        fields: ['code'],
      }),
    })
      .then(({ invites }) => (invites.length ? invites[0].code : ''))
      .catch(() => '')
  }

  async function generateCode(currentCode) {
    const code = nanoid()
    return await execute({
      token: user.token,
      query: currentCode
        ? update('invites', {
            filters: { where: { event_id: { _eq: evt.id } } },
            values: { code },
          })
        : create('invites', { values: { event_id: evt.id, code } }),
    }).then(() => {
      ping({ message: 'New invite link generated', type: 'info' })
      return code
    })
  }

  const generateNewLink = code => (codeLoader = generateCode(code))
  const createLink = () => generateNewLink('')

  function copyLink() {
    const copyText = document.getElementById('invite')
    copyText.select()
    document.execCommand('copy')
    ping({ message: 'Invite link copied to clipboard', type: 'info' })
  }

  function signUp() {
    execute({
      token: user.token,
      query: newAttendance(user, evt),
    }).then(({ insert_attendances: { returning: [attendance] } }) => {
      ping({ message: `You're now attending this event!`, type: 'success' })
      attendances = [...attendances, attendance]
      existingAttendance = attendance
      codeLoader = loadInviteCode(existingAttendance)
    })
  }
  function cancelAttendance() {
    execute({
      token: user.token,
      query: del('attendances', {
        filters: {
          where: {
            _and: [
              { user_id: { _eq: user.id } },
              { event_id: { _eq: evt.id } },
            ],
          },
        },
      }),
    }).then(() => {
      ping({ message: 'You are no longer attending this event', type: 'info' })
      attendances = attendances.filter(a => a.user.id !== user.id)
      existingAttendance = undefined
      codeLoader = loadInviteCode(existingAttendance)
    })
  }

  function checkIn() {}

  const thisEvent = k => ({ where: { [k]: { _eq: evt.id } } })
  function deleteEvent() {
    if (
      window.prompt("Are you sure? Please enter this event's ID to confirm") ===
      evt.id
    ) {
      execute({
        token: user.token,
        query: merge([
          {
            type: 'delete',
            root: 'attendances',
            filters: thisEvent('event_id'),
          },
          { type: 'delete', root: 'games', filters: thisEvent('event_id') },
          { type: 'delete', root: 'events', filters: thisEvent('id') },
        ]),
      }).then(() => {
        ping({ message: 'Event successfully deleted', type: 'info' })
        goto('/')
      })
    }
  }
  function updateEvent({ detail: { data: updatedEvt } }) {
    return execute({
      token: user.token,
      query: update('events', {
        filters: thisEvent('id'),
        values: { last_updated: 'now()', ...updatedEvt },
      }),
    })
      .then(() => {
        const { description } = updatedEvt
        evt = {
          ...evt,
          ...updatedEvt,
          ...(description
            ? { description: decodeURIComponent(description) }
            : {}),
        }
        editing = false
        ping({ message: 'Event updated successfully!', type: 'success' })
      })
      .catch(e =>
        ping({
          message:
            'Oops! Looks like we had trouble updating the event. Please try again or contact support if this issue persists.',
          debug: e,
          type: 'danger',
          duration: 10000,
        })
      )
  }

  // ToDo: implement
  // function switchOrganizer() {}

  const buttonText = (processing, verb, rest) =>
    processing ? `${verb}ing ${rest}...` : `${verb} ${rest}`

  function setAction(signedUp, canCheckIn, processing) {
    if (signedUp && canCheckIn)
      return {
        action: checkIn,
        actionButton: {
          icon: 'map-pin',
          label: buttonText(processing, 'Check', 'In'),
        },
      }
    else if (signedUp && userIsOrganizer)
      return {
        action: null,
        actionButton: {
          icon: '',
          label: buttonText(processing, 'Switch', 'Organizer'),
        },
      }
    else if (signedUp && !userIsOrganizer)
      return {
        action: cancelAttendance,
        actionButton: {
          icon: 'user-x',
          label: buttonText(processing, 'Cancel', 'Attendance'),
        },
      }
    else
      return {
        action: signUp,
        actionButton: {
          icon: 'user-check',
          label: buttonText(processing, 'Sign', 'Up'),
        },
      }
  }
  let tabs = {
    details: { icon: 'star', label: 'Details' },
    ...(user
      ? {
          attendees: {
            icon: 'users',
            label: 'Attendees',
            qty: attendances.length,
          },
          games: { icon: 'go-pieces', label: 'Games', qty: games.length },
        }
      : {}),
  }

  let currentTab = 'details',
    processing = false,
    editing = false

  const toggleEdit = () => (editing ^= true)

  $: ({ action, actionButton } = setAction(
    !!existingAttendance,
    canCheckIn,
    processing
  ))

  /* eslint-disable no-unused-vars */
  const editable = ({ last_updated, id, ...e }) => e

  let showNewGameForm = false

  const toggleNewGameForm = () => (showNewGameForm ^= true)

  function addNewGame({ detail: { game } }) {
    const { black, white, id, ...rest } = game
    toggleNewGameForm()
    execute({
      token: user.token,
      query: create('games', {
        values: { ...rest, black: black.id, white: white.id, event_id: evt.id },
      }),
    }).then(() => {
      ping({ message: `Game added successfully`, type: 'success' })
      games = [...games, { ...game, recorded: new Date() }]
      tabs.games.qty += 1
    })
  }

  let itemListProps = {
    component: UserCard,
    items: attendances.map(a => ({
      ...a.user,
      isOrganizer: isOrganizer(a.user.id),
    })),
    options: { keys: ['user.name'] },
    types: { singular: 'Attendee', plural: 'Attendees' },
    placeholder: 'Search all attendees by name...',
  }

  let gameListProps = {
    component: GameCard,
    options: { keys: ['black.name', 'white.name'] },
    types: { singular: 'Game', plural: 'Games' },
    placeholder: 'Search games by player name...',
  }

  $: gameListProps.add =
    attendances.length > 1 && user ? toggleNewGameForm : undefined
  $: gameListProps.items = games
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

  .invite-link {
    @apply ml-8 flex flex-col mb-8 mr-4;
  }

  .invite-link input {
    @apply px-3 py-2 font-mono text-gray-600 mb-1 border rounded border-gray-400;
  }

  .invite-link div {
    @apply flex text-xs justify-between;
  }

  .invite-buttons button {
    @apply text-blue-500;
  }

  .invite-buttons button:hover {
    @apply underline;
  }
</style>

<svelte:head>
  <title>{evt.name} on BadukClub</title>
  <meta
    name="description"
    content="Play Go in person at {evt.address}, or search the definitive map of
    Go meetups that always stays up-to-date." />
</svelte:head>

<Sidebar>
  <h4 class="text-2xl font-semibold mb-6 text-center">{evt.name}</h4>
  <a
    href="mailto:{orgEmail}"
    class="flex justify-center hover:underline text-blue-500 w-full mb-8">
    Contact Organizers
  </a>
  {#if existingAttendance}
    <div class="invite-link invite-buttons">
      <span class="mb-2">Invite Link</span>
      {#await codeLoader}
        <input type="text" readonly value="loading..." />
      {:then code}
        {#if !code}
          <input type="text" readonly value="no code" />
          <div>
            <button on:click={createLink}>Reset Link</button>
          </div>
        {:else}
          <input
            type="text"
            readonly
            id="invite"
            value="{process.env.APP_DOMAIN}/{code}" />
          <div>
            <button on:click={() => generateNewLink(code)}>Reset Link</button>
            <button on:click={copyLink}>Copy Link</button>
          </div>
        {/if}
      {/await}
    </div>
  {/if}
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
  {#if user && action}
    <button
      on:click={action}
      class="w-full p-8 flex border-t-2 border-b-2 border-gray-800">
      {#if actionButton.icon}
        <div class="mr-4">
          <Icon id={actionButton.icon} />
        </div>
      {/if}
      <span class="font-semibold">{actionButton.label}</span>
    </button>
  {:else if !user}
    <a
      href="login?redir=/events/{evt.id}"
      class="block w-full p-8 border-t-2 border-b-2 border-gray-800">
      Log in
    </a>
  {/if}
</Sidebar>

<div class="md:m-4 w-full">
  {#if currentTab === 'details'}
    <div class="relative">
      {#if !editing}
        <EventCard {...evt} expanded />
        {#if userIsOrganizer}
          <div class="absolute right-0 top-0 p-6 flex">
            <button
              on:click={toggleEdit}
              data-cy="edit-button"
              class="pr-4 opacity-75 hover:opacity-100 flex flex-col
              items-center">
              <Icon id="edit-2" />
              <span class="text-xs">edit</span>
            </button>
            <button
              on:click={deleteEvent}
              data-cy="delete-button"
              class="opacity-75 hover:opacity-100 flex flex-col items-center">
              <Icon id="trash-2" />
              <span class="text-xs">delete</span>
            </button>
          </div>
        {/if}
      {:else}
        <div class="rounded-lg bg-white shadow-xl p-4 w-full">
          <EventForm
            initial={editable(evt)}
            on:submit={updateEvent}
            on:cancel={toggleEdit} />
        </div>
      {/if}
    </div>
  {:else if currentTab === 'attendees'}
    <ItemList {...itemListProps} />
    {#if existingAttendance}
      {#await codeLoader then code}
        <div class="bg-white rounded-lg shadow-xl p-4">
          <h2 class="text-4xl font-bold">Invite your friends to play!</h2>
          <ol class="text-lg list-decimal">
            <li class="ml-5 p-2 invite-buttons">
              {#if !code}
                <button on:click={createLink}>Create the invite link</button>
              {:else}
                <button on:click={copyLink}>Copy the invite link</button>
              {/if}
            </li>
            <li class="ml-5 p-2">Share the link with your friends</li>
            <li class="ml-5 p-2">???</li>
            <li class="ml-5 p-2">Profit!</li>
          </ol>
        </div>
      {/await}
    {/if}
  {:else}
    {#if existingAttendance && attendances.length < 2}
      {#await codeLoader then code}
        <div class="bg-white rounded-lg shadow-xl p-4 invite-buttons">
          <h2 class="text-2xl font-bold mb-4">It takes two to play...</h2>
          <p>
            {#if !code}
              <button on:click={createLink}>Create the invite link</button>
            {:else}
              <button on:click={copyLink}>Copy the invite link</button>
            {/if}
            and send it to your friends to start recording games.
          </p>
        </div>
      {/await}
    {/if}
    <ItemList {...gameListProps} />
    {#if showNewGameForm}
      <Modal on:close={toggleNewGameForm}>
        <GameForm
          resetOnSubmit
          on:submit={addNewGame}
          on:cancel={toggleNewGameForm}
          players={attendances.map(a => a.user)} />
      </Modal>
    {/if}
  {/if}
</div>
