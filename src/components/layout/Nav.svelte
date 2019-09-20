<script>
  import Icon from '/components/Icon'
  import Logo from '/components/layout/Logotype'
  import { stores } from '@sapper/app'
  import { onMount } from 'svelte'
  import { select, execute, update } from '/api/db/index'
  const { session } = stores()
  let { user, picture, name } = $session ? $session : {}
  let optsVisible = false

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
    @apply absolute bg-white border-gray-400 rounded-sm p-2 border;
    top: 32px;
    right: 0;
  }

  .profile:hover > span {
    @apply opacity-100;
  }
</style>

<nav
  class="fixed top-0 z-20 w-screen bg-white flex justify-between items-center
  h-16 border-grey-400 border-b">
  <a href="." rel="prefetch" class="w-56" id="logo">
    <Logo />
  </a>
  <div class="flex items-center justify-around w-40">
    <a
      href="map"
      rel="prefetch"
      class="flex flex-col items-center opacity-50 hover:opacity-100">
      <Icon id="map" />
      <span class="text-xs" style="margin-top: -2px">Explore</span>
    </a>
    {#if user}
      <div
        on:click={toggleProfileOpts}
        data-cy="profile-opts"
        class="relative flex flex-col items-center cursor-pointer profile">
        {#if picture}
          <img src={picture} alt={name} class="w-6 h-auto rounded-full" />
          <span class="text-xs {optsVisible ? '' : 'opacity-50'}">{name}</span>
        {:else}
          <div class="w-6 h-6 rounded-full bg-gray-200" />
          <span class="text-xs opacity-50">loading...</span>
        {/if}
        <div class="{optsVisible ? '' : 'hidden '}options">
          <a href="profile" rel="prefetch" class="hover:underline">Profile</a>
          <a href="profile?tab=settings" rel="prefetch" class="hover:underline">
            Settings
          </a>
          <a href="logout" data-cy="logout" class="hover:underline">Log Out</a>
        </div>
      </div>
    {:else}
      <a
        href="login"
        data-cy="login"
        class="block bg-blue-400 text-white py-2 px-4 hover:bg-blue-500">
        Login
      </a>
    {/if}
  </div>
</nav>
