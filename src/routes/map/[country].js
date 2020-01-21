import { getBoundingBox } from '/api/location/index'

export async function get(req, res) {
  let { country } = req.params
  const response = getBoundingBox(country)
  if (!response) return res.redirect('/map')

  const {
    name,
    code,
    bounds: [w, s, e, n],
  } = response
  return res.redirect(
    `/map?code=${code.toLowerCase()}&name=${encodeURIComponent(
      name
    )}&bounds=${w},${s},${e},${n}`
  )
}
