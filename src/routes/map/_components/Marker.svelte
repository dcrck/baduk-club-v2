<script>
  import { marker } from '../_mapbox.js'
  import Icon from '/components/Icon'

  export let location, label, id
  export let color = '#262621'
  export let size = 20
</script>

<style>
  .marker {
    @apply z-auto;
  }
  .marker:hover {
    @apply z-20;
  }
  :global(.marker.selected) {
    @apply z-10;
  }
  .marker > div {
    @apply absolute w-full h-full top-0 left-0 rounded-full;
    z-index: -1;
    transition: box-shadow 0.2s ease;
    box-shadow: none;
  }

  .marker:hover > div,
  :global(.marker.selected) > div {
    box-shadow: 0 0 25px 10px rgba(0, 0, 0, 0.8),
      0 0 10px -5px rgba(0, 0, 0, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.8) !important;
  }
</style>

<button
  use:marker={location}
  class="marker relative"
  title={label}
  {id}
  on:click>
  <Icon id="circle" fill={color} color="#cbd5e0" />
  <div />
</button>
