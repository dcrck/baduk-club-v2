import countries from './_data.json'

export async function get(req, res) {
  let { country } = req.params
  try {
    if (country.length == 2) country = countries[country.toUpperCase()]
    country = country.toUpperCase()
    const {
      sw: { lat: s, lon: w },
      ne: { lat: n, lon: e },
      name,
    } = countries[country]
    res.redirect(
      `/map?code=${country}&name=${encodeURIComponent(
        name
      )}&bounds=${w},${s},${e},${n}`
    )
  } catch (e) {
    res.redirect('/map')
  }
}
