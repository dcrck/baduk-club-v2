<script>
  import Icon from '/components/Icon'
  import Logo from '/components/layout/Logotype'
  import { stores } from '@sapper/app'
  const { session } = stores()
  let { user, picture, name } = $session ? $session : {}
  let optsVisible = false

  const toggleProfileOpts = () => (optsVisible ^= true)
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
  <a href="." class="w-56" id="logo">
    <Logo />
  </a>
  <div class="flex items-center justify-around w-40">
    <a
      href="map"
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
          <span class="text-xs">User?</span>
        {/if}
        <div class="{optsVisible ? '' : 'hidden '}options">
          <a href="profile" class="hover:underline">Profile</a>
          <a href="profile?tab=settings" class="hover:underline">Settings</a>
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
