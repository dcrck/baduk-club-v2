import fetch from 'node-fetch'
import { execute, select } from '/api/db/index'
import { newAttendance } from '/api/db/helpers'
import { validate } from '/auth'

export async function get(req, res) {
  const user = validate(req)
  const { code } = req.params
  if (user.unauthorized) return res.redirect(302, `/login?redir=/i/${code}`)
  const gql = q => execute({ query: q, token: user.token }, fetch)
  const { invites } = await gql(
    select('invites', {
      filters: { where: { code: { _eq: code } } },
      fields: ['event_id'],
    })
  )
  if (!invites.length) return res.redirect(302, '/')
  const [{ event_id }] = invites
  await gql(newAttendance(user, { id: event_id })).catch(e =>
    !/duplicate key value violates unique constraint/.test(e.message)
      ? Promise.reject(e)
      : ''
  )
  return res.redirect(302, `/events/${event_id}`)
}
