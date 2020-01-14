import addMinutes from 'date-fns/addMinutes'
import isBefore from 'date-fns/isBefore'

export const weekdays = [
  { full: 'Sunday', two: 'SU', one: 'S' },
  { full: 'Monday', two: 'MO', one: 'M' },
  { full: 'Tuesday', two: 'TU', one: 'T' },
  { full: 'Wednesday', two: 'WE', one: 'W' },
  { full: 'Thursday', two: 'TH', one: 'R' },
  { full: 'Friday', two: 'FR', one: 'F' },
  { full: 'Saturday', two: 'SA', one: 'S' },
]

export const positions = [
  { full: 'first', number: '+1' },
  { full: 'second', number: '+2' },
  { full: 'third', number: '+3' },
  { full: 'fourth', number: '+4' },
  { full: 'fifth', number: '+5' },
  { full: 'last', number: '-1' },
]

function unabbreviate(abbr, capitalize = true) {
  const { full } = weekdays.find(day => day.two === abbr) || { full: '' }
  return capitalize ? full.charAt(0).toUpperCase() + full.slice(1) : full
}

function whichDay(n) {
  const { full } = positions.find(pos => pos.number === n) || { full: '' }
  return full
}

function toText(r) {
  const regex = /FREQ=(\w+);BYDAY=(\S+)/
  const result = r.match(regex)
  if (!result) return r

  return result[1] === 'WEEKLY'
    ? result[2]
        .split(',')
        .map(unabbreviate)
        .map(d => d + 's')
        .join(', ')
    : result[2]
        .split(',')
        .map(d => `${whichDay(d.slice(0, 2))} ${unabbreviate(d.slice(2))}`)
        .join(', ') + ' monthly'
}

const timeString = d =>
  addMinutes(d, d.getTimezoneOffset()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

const localeString = (d, tz) =>
  (tz ? addMinutes(d, d.getTimezoneOffset()) : d).toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export function isUpcoming({ rrule, end }) {
  const now = new Date(),
    date = new Date(end)
  return !!rrule || isBefore(now, addMinutes(date, date.getTimezoneOffset()))
}

export function parse({ rrule, start, end }, tz) {
  const rruleString = rrule ? toText(rrule) : rrule
  const startDate = new Date(start),
    endDate = new Date(end)
  const startStr = rrule ? timeString(startDate) : localeString(startDate, tz)
  const endStr = rrule ? timeString(endDate) : localeString(endDate, tz)
  return { rrule: rruleString, start: startStr, end: endStr }
}

// string representation of an rrule
export function toString(timeObj, tz = false) {
  const { rrule, start, end } = parse(timeObj, tz)
  return rrule ? `${rrule}, ${start} - ${end}` : `${start} - ${end}`
}

// convert frequency and day positions to an RRule String
export function toRRuleString(freq, positions) {
  return Array.isArray(positions)
    ? `FREQ=${freq.toUpperCase()};BYDAY=${positions.join(',')}`
    : ''
}
export const utcTimestamp = (dt, time) =>
  `${dt || '2019-04-01'}T${time}:00.000Z`

/*function deconstructTime([,date,time]) {
  return date === '2019-04-01' ? { time } : { date, time }
}

function deconstructRRule([,freq, positions]) {
  return { freq: freq.toLowerCase(), positions: positions.split(',') }
}

function toObject({ start, end, rrule }) {
  return {
    start: deconstructTime(start.match(/(\S+)T(\S+):00.000Z/)),
    end: deconstructTime(end.match(/(\S+)T(\S+):00.000Z/)),
    ...(rrule ? deconstructRRule(rrule.match(/FREQ=(\w+);BYDAY=(\S+)/)) : { freq: 'once' })
  }
}*/
