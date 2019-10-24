<script>
  import Footer from '/components/layout/Footer'
  import Icon from '/components/Icon'
  import { stores } from '@sapper/app'
  let { session } = stores()
  let { user } = $session

  let visible = false

  const toggleSidebar = () => (visible ^= true)
</script>

<style>
  div.sidebar {
    @apply fixed w-56 bg-white left-0 pt-12 z-50;
    top: 4rem;
    overflow-y: scroll;
    height: calc(100vh - 4rem);
    transition: 200ms;
  }

  .show-sidebar {
    @apply fixed hidden left-0 m-4 w-12 h-12 rounded-full bg-gray-800 z-50;
    bottom: 2rem;
  }

  @media screen and (max-width: 640px) {
    div.sidebar {
      @apply border-r border-gray-300;
      transform: translateX(-100%);
    }

    div.sidebar.nouser {
      top: 5.75rem;
    }

    div.sidebar.visible {
      transform: translateX(0%);
    }

    .show-sidebar {
      @apply flex shadow-lg justify-center items-center;
      transition: 200ms;
      transform: translateX(0);
    }
    .sidebar.visible + .show-sidebar {
      transform: translateX(14rem);
    }
  }
</style>

<div class="sidebar" class:visible class:nouser={!user}>
  <div class="relative h-full flex flex-col justify-between">
    <div>
      <slot />
    </div>
    <div>
      <Footer small />
    </div>
  </div>
</div>

<button class="show-sidebar" on:click={toggleSidebar}>
  <Icon id="chevrons-{visible ? 'left' : 'right'}" size="32" color="white" />
</button>
