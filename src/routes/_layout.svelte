<script>
  export let segment
  import Nav from '/components/layout/Nav'
  import Logo from '/components/layout/Logotype'
  import Footer from '/components/layout/Footer'
  import Toasts from '/components/layout/Toasts'
  import { stores } from '@sapper/app'
  import { setContext } from 'svelte'
  import { toastKey } from '/utils/index'

  let { page } = stores()
  let background = 'white'

  setContext(toastKey, {
    ping: ({ message, type, debug, timeout }) => {
      toasts.show(message, type, timeout)
      let log = `[${type.toUpperCase()}] ${debug || message}`
      if (type === 'danger') console.error(log)
      else if (type === 'warning') console.warn(log)
      else console.log(log)
    },
  })

  let sidebar, nav, toasts
  function setLayout({ path }) {
    sidebar = ['/events/new', '/'].indexOf(path) === -1
    background = sidebar && segment !== 'docs' ? 'gray-200' : 'white'
    nav = ['/events/new'].indexOf(path) === -1
  }

  $: setLayout($page)
</script>

<style>
  main {
    @apply relative mb-0 mt-16 py-8 px-0;
  }

  main.sidebar {
    @apply ml-56 p-8;
  }

  @media screen and (max-width: 640px) {
    main {
      @apply p-2;
    }
    main.sidebar {
      @apply ml-0 p-2;
    }
  }
</style>

{#if nav}
  <Nav />
{:else}
  <div
    class="fixed top-0 z-20 w-screen bg-white flex justify-center items-center
    h-16 border-grey-400 border-b">
    <a href="." class="w-56" id="logo">
      <Logo />
    </a>
  </div>
{/if}

{#if sidebar}
  <div class="fixed inset-0 w-screen h-screen bg-gray-200" />
{/if}
<main class:sidebar class="bg-{background}">
  <div class="{sidebar ? 'max-w-xl' : 'max-w-2xl mx-auto'} xl:max-w-4xl">
    <slot />
    {#if !sidebar}
      <div class="mt-16">
        <Footer />
      </div>
    {/if}
  </div>
</main>

<Toasts bind:this={toasts} />
