<script>
  import Footer from '/components/layout/Footer'
  import Icon from '/components/Icon'

  let visible = false

  const toggleSidebar = () => (visible ^= true)
</script>

<style>
  div.sidebar {
    @apply fixed w-56 bg-white left-0 pt-12 z-50;
    top: 4rem;
    height: calc(100vh - 4rem);
    transition: 200ms;
  }

  .show-sidebar {
    @apply fixed hidden left-0 bottom-0 m-4 w-12 h-12 rounded-full bg-gray-800 z-40;
  }
  .sidebar button {
    @apply absolute right-0 pr-4 pt-4;
    top: -3rem;
  }

  @media screen and (max-width: 640px) {
    div.sidebar {
      @apply border-r border-gray-300;
      transform: translateX(-100%);
    }

    div.sidebar.visible {
      transform: translateX(0%);
    }

    .show-sidebar {
      @apply flex shadow-lg justify-center items-center;
    }
  }
</style>

<div class="sidebar" class:visible>
  <div class="relative h-full flex flex-col justify-between">
    <div>
      <slot />
    </div>
    <div>
      <Footer small />
    </div>
    <button
      on:click={toggleSidebar}
      class="block md:hidden opacity-50 hover:opacity-100">
      <Icon id="x" />
    </button>
  </div>
</div>

<button class="show-sidebar" on:click={toggleSidebar}>
  <Icon id="chevrons-right" size="32" color="white" />
</button>
