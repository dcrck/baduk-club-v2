<script>
  import Icon from '/components/Icon'
  import Logo from '/components/layout/Logotype'
  import { stores } from '@sapper/app'
  import { onMount } from 'svelte'
  import { select, execute, update } from '/api/db/index'
  const { session } = stores()
  let { user, picture, name } = $session ? $session : {}
  let optsVisible = false

  $: first = name ? name.split(' ')[0] : ''
  $: displayName = first.length > 14 ? first.slice(0, 14) + '...' : first

  const toggleProfileOpts = () => (optsVisible ^= true)
  // load user picture and name if they're not already 'seeded' in the session,
  // then store them in the session for future use
  onMount(() => {
    if (user && (!picture || !name)) {
      const gql = query => execute({ query, token: user.token })
      const auth0Query = select('auth0', { fields: ['picture'] })
      const profileQuery = select('users', {
        filters: { where: { id: { _eq: user.id } }, limit: 1 },
        fields: ['name', 'picture'],
      })
      gql(profileQuery)
        .then(({ users: [u] }) => {
          name = u.name
          return u.picture
            ? Promise.resolve({ auth0: { picture: u.picture }, noUpdate: true })
            : gql(auth0Query)
        })
        .then(({ auth0, noUpdate }) => {
          picture = auth0.picture
          session.update(s => ({ ...s, picture, name }))
          return !noUpdate
            ? gql(
                update('users', {
                  filters: { where: { id: { _eq: user.id } } },
                  values: { picture },
                })
              )
            : Promise.resolve()
        })
    }
  })
</script>

<style>
  .options {
    @apply absolute bg-white border-gray-400 rounded-sm p-2 border flex-col;
    top: 32px;
    right: 0;
  }

  .profile:hover > span {
    @apply opacity-100;
  }
</style>

<nav
  class:flex-col={!user}
  class="fixed top-0 z-20 w-screen bg-white flex md:flex-row justify-between items-center
         md:h-16 border-grey-400 border-b">
  <a href="." rel="prefetch" class="w-56 my-2 md:my-0" id="logo">
    <Logo />
  </a>
  <div class="flex items-center px-2 my-2 md:my-0">
    {#if user}
      <a
        href="map"
        rel="prefetch"
        class="flex flex-col items-center opacity-50 hover:opacity-100 mr-8">
        <Icon id="map" />
        <span class="text-xs" style="margin-top: -2px">Map</span>
      </a>
      <div
        on:click={toggleProfileOpts}
        data-cy="profile-opts"
        class="relative flex flex-col items-center cursor-pointer profile mr-8">
        {#if picture}
          <img src={picture} alt={name} class="w-6 h-auto rounded-full" />
          <span class="text-xs text-center" class:opacity-50={!optsVisible}>
            {displayName}
          </span>
        {:else}
          <div class="w-6 h-6 rounded-full bg-gray-200" />
          <span class="text-xs opacity-50">loading...</span>
        {/if}
        <div class="options flex" class:hidden={!optsVisible}>
          <a href="profile" rel="prefetch" class="hover:underline">Profile</a>
          <a href="profile?tab=settings" rel="prefetch" class="hover:underline">
            Settings
          </a>
          <a href="logout" data-cy="logout" class="hover:underline">Log Out</a>
        </div>
      </div>
    {:else}
      <a href="map" data-cy="map" class="hover:underline md:mr-4">Map</a>
      <a href="about" data-cy="about" class="hover:underline mx-8 md:mr-4 md:ml-0">About Us</a>
      <a href="login" data-cy="login" class="hover:underline md:mr-4">Login</a>
    {/if}
  </div>
</nav>
