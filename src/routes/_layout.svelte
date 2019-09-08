<script>
  export let segment
  import Nav from '/components/layout/Nav'
  import Logo from '/components/layout/Logotype'
  import Footer from '/components/layout/Footer'
  import { stores } from '@sapper/app'

  let { page } = stores()
  let background = 'white'

  let sidebar, nav
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
