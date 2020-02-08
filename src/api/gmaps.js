const param_string = (params = {}) =>
  '?' +
  Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

const send = (endpoint, params, f) => f(`/${endpoint}${param_string(params)}`)

/* forward geocoding; that is, look up a single location by name and get query results */
export const search = (search_text, f = fetch) =>
  search_text
    ? send(`map/places`, { input: search_text, type: 'autocomplete' }, f)
        .then(response => response.json())
        .then(({ results }) => results)
    : Promise.resolve([])

export const geocode = (address, f = fetch) =>
  address
    ? send(`map/places`, { address, type: 'geocode' }, f)
        .then(response => response.json())
        .then(({ location }) => location)
    : Promise.resolve(null)
