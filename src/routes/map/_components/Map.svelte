<script>
  import { onMount, createEventDispatcher, setContext } from 'svelte'
  import { key } from '../_mapbox.js'
  import { getCountry, getBoundingBox } from '/api/location/index'

  export let options
  export let centerOnUser = false
  export let style = 'mapbox://styles/mapbox/light-v10'

  const dispatch = createEventDispatcher()
  const USA_BOUNDS = [-125.0011,24.9493,-66.9326,49.5904]
  let container, map, mapbox

  setContext(key, {
    getMap: () => map,
    getMapbox: () => mapbox,
  })

  onMount(async () => {
    /* eslint-disable-line */
    const mbgl = await import('mapbox-gl')
    mapbox = mbgl.default
    if (centerOnUser && !options.bounds) {
      const country = await getCountry()
      const data = getBoundingBox(country)
      if (data) options.bounds = data.bounds
    }
    mapbox.accessToken = process.env.MAPBOX_ACCESS_TOKEN
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/mapbox-gl/dist/mapbox-gl.css'
    let el
    link.onload = () => {
      el = new mapbox.Map({
        container,
        style,
        bounds: USA_BOUNDS,
        ...options,
      })
      el.on('load', () => {
        map = el
        dispatch('ready')
      })
    }
    document.head.appendChild(link)
    return () => {
      map.remove()
      link.parentNode.removeChild(link)
    }
  })
</script>

<style>
  .map {
    width: 100%;
    height: 100%;
  }

  .placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .placeholder > p {
    text-align: center;
    margin-bottom: 1em;
    font-size: 2em !important;
    font-family: sans-serif !important;
  }

  .placeholder a {
    @apply text-blue-600;
  }

  .placeholder a:hover {
    @apply underline;
  }

  .placeholder ul {
    list-style: circle;
  }

  .placeholder li {
    margin: 0.5em 0;
  }

</style>

<div class="map" bind:this={container}>
  {#if map}
    <slot />
  {:else}
    <div class="placeholder w-5/6 md:w-auto">
      <p>Loading map...</p>
      <span class="text-sm md:text-base">If this map doesn't load after a few seconds, try:</span>
      <ul class="text-sm md:text-base">
        <li>Refreshing/restarting the browser</li>
        <li>Clearing your browser's cache</li>
        <li>
          Reporting the problem to Mapbox on
          <a target="_blank" rel="noopener" href="https://github.com/mapbox/mapbox-gl-js/issues">
            GitHub
          </a>
          or through the
          <a target="_blank" rel="noopener" href="https://support.mapbox.com/hc/en-us/requests/new?ticket_form_id=360000291231">
            MapBox support page
          </a>,
          and
          <a target="_blank" rel="noopener" href="mailto:support@baduk.club">
            letting us know
          </a>
        </li>
      </ul>
    </div>
  {/if}
</div>
