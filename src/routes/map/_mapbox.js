export const key = {}

import { getContext } from 'svelte'

export function marker(node, { lng, lat }) {
  const { getMap, getMapbox } = getContext(key)
  const map = getMap()
  const mapbox = getMapbox()
  const marker = new mapbox.Marker(node).setLngLat([lng, lat]).addTo(map)
  return {
    destroy: () => marker.remove(),
  }
}
