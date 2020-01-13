import { execute, update, select } from '/api/db/index'
import { validate } from '/auth'
import fetch from 'node-fetch'

export async function get(req, res) {
  const { id } = req.params
  const user = validate(req)
  const { code } = req.query

  if (!code) return res.redirect(`/events/${id}`)

  if (user.unauthorized) {
    const redirectLink = encodeURIComponent(`/events/id/refresh?code=${code}`)
    console.log('no user, redirecting...')
    return res.redirect(`/login?redir=${redirectLink}`)
  }

  const { token } = user
  const gql = q => execute({ query: q, token: token }, fetch)

  const { events } = await gql(
    select('events', {
      filters: {
        where: {
          _and: [{ id: { _eq: id } }, { confirm_code: { _eq: code } }],
        },
      },
      fields: ['id'],
    })
  )

  if (!events.length) {
    console.log('confirm code is expired or invalid')
    return res.redirect(`/events/${id}`)
  }

  return await gql(
    update('events', {
      filters: { where: { id: { _eq: id } } },
      values: { last_updated: 'now()', confirm_code: null },
    })
  )
    .then(({ update_events: { affected_rows: rows } }) => {
      if (rows == 0) return res.redirect(`/events/${id}`)
      else return res.redirect(`/events/${id}?refresh=1`)
    })
    .catch(() => res.redirect(`/events/${id}`))
}
