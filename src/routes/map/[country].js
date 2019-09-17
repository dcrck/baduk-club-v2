import countries from './_data.json'

export async function get(req, res) {
  const { country } = req.params
  const result = Object.keys(countries).find(c => c === country)
  try {
    const {
      sw: { lat: s, lon: w },
      ne: { lat: n, lon: e },
    } = countries[result]
    res.redirect(`/map?code=${country}&bounds=${w},${s},${e},${n}`)
  } catch (e) {
    res.redirect('/map')
  }
}
