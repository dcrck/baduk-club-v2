const param_string = (params = {}) =>
  '?' +
  Object.entries(params)
    .map(([k, v]) => `${k}=${v}&`)
    .join('') +
  `access_token=${process.env.MAPBOX_ACCESS_TOKEN}`

const send = (endpoint, params, f) =>
  f(`https://api.mapbox.com/${endpoint}${param_string(params)}`)

/* forward geocoding; that is, look up a single location by name and get query results */
export const search = (search_text, f = fetch) =>
  search_text
    ? send(
        `geocoding/v5/mapbox.places/${search_text}.json`,
        { autocomplete: true, fuzzyMatch: true, types: ['address', 'poi'] },
        f
      )
        .then(response => response.json())
        .then(json => json.features)
    : Promise.resolve([])
