<script>
  import Footer from './Footer.svelte'
</script>

<style>
  div.sidebar {
    @apply fixed w-56 bg-white left-0 pt-12 z-50 flex flex-col justify-between;
    top: 4rem;
    height: calc(100vh - 4rem);
  }
</style>

<div class="sidebar">
  <div>
    <slot />
  </div>
  <div>
    <Footer small />
  </div>
</div>
