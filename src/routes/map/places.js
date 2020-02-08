const client = require('@google/maps').createClient({
  key: process.env.GMAPS_API_KEY,
  Promise: Promise,
})

async function autocomplete({ query: { input } }, res) {
  if (!input) {
    return res.status(500).json({ error: 'no input' })
  }
  return await client
    .placesQueryAutoComplete({
      input,
    })
    .asPromise()
    .then(r => {
      return r.json.predictions.filter(p => !!p.place_id)
    })
    .then(results => res.status(200).json({ results }))
}

async function geocode({ query: { address } }, res) {
  if (!address) {
    return res.status(500).json({ error: 'no address' })
  }
  return await client
    .geocode({
      address,
    })
    .asPromise()
    .then(r => {
      return r.json.results[0].geometry.location
    })
    .then(location => res.status(200).json({ location }))
}

export async function get(req, res) {
  const { type } = req.query
  if (type == 'geocode') {
    return geocode(req, res)
  } else if (type == 'autocomplete') {
    return autocomplete(req, res)
  } else {
    return res.status(500).json({ error: 'invalid type' })
  }
}
