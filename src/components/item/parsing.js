import fromNow from 'date-fns/formatDistanceToNow'
import { parse } from '/utils/rrule'

const address_object = ([main, ...rest]) => ({ main, rest: rest.join(', ') })

const address = a => address_object(a.split(', '))
const last_updated = t => fromNow(new Date(t))
const recorded = t => fromNow(new Date(t))
const times = ts => ts.map(parse)

export const parsers = {
  address,
  last_updated,
  times,
  recorded,
}

export default o =>
  Object.entries(o).reduce(
    (obj, [k, v]) => (v ? { ...obj, [k]: parsers[k](v) } : obj),
    {}
  )
