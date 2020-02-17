import countries from './data.json'

export function getBoundingBox(code) {
  if (!code) return undefined
  if (code.length == 2) code = countries[code.toUpperCase()]
  const data = countries[code.toUpperCase()]
  if (!data) return undefined
  const {
    sw: { lat: s, lon: w },
    ne: { lat: n, lon: e },
    name,
  } = data
  return { name, code, bounds: [w, s, e, n] }
}

export const getCountry = (f = fetch) =>
  f('https://ipinfo.io/json', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${process.env.IPINFO_TOKEN}`,
      accept: 'application/json',
    },
  })
    .then(r => (r.ok ? r.json() : { country: null }))
    .then(({ country }) => country)
    .catch(() => 'US')
