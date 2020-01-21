const checkLat = n => !isNaN(n) && n >= -90 && n <= 90
const checkLon = n => !isNaN(n) && n >= -180 && n <= 180

export const checkBounds = ([w, s, e, n]) =>
  checkLon(w) && checkLat(s) && checkLon(e) && checkLat(n) && s < n && w < e
    ? [w, s, e, n]
    : undefined

export const addArticle = name =>
  name.includes('Islands') ||
  name.includes('Republic') ||
  name.includes('States') ||
  name.includes('Kingdom')
    ? 'the ' + name
    : name

export const getCountry = f =>
  f('https://ipinfo.io/json', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${process.env.IPINFO_TOKEN}`,
      accept: 'application/json',
    },
  })
    .then(r => r.json())
    .then(x => console.log(x))
