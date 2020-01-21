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
  div {
    width: 100%;
    height: 100%;
  }

  p {
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em !important;
    font-family: sans-serif !important;
  }
</style>

<div bind:this={container}>
  {#if map}
    <slot />
  {:else}
    <p>Loading map...</p>
  {/if}
</div>
