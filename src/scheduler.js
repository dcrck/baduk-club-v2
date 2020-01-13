import cron from 'node-cron'
import fetch from 'node-fetch'
import { send } from './mailer'
import sub from 'date-fns/sub'
import formatISO from 'date-fns/formatISO'
import { select, update, execute } from '/api/db/index'
import nanoid from 'nanoid'

function sudo(query) {
  return execute(
    {
      query,
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
      },
    },
    fetch
  )
}

export function scheduleTasks() {
  // Send 6-month reminder emails, if any, at 4am daily
  cron.schedule('0 4 * * *', async () => {
    const today = new Date()
    const months = 1
    const staleEventTimeLimit = sub(today, { months })
    // fetch all old events
    const events = await sudo(
      select('events', {
        filters: {
          where: {
            _and: [
              { last_updated: { _lte: formatISO(staleEventTimeLimit) } },
              { confirm_code: { _is_null: true } },
            ],
          },
        },
        fields: ['organizer_id', 'id', 'last_updated', 'name'],
      })
    ).then(({ events }) =>
      events.map(ev => ({ ...ev, confirm_code: nanoid() }))
    )

    // add confirm codes to old events
    await Promise.all(
      events.map(({ id, confirm_code }) => {
        sudo(
          update('events', {
            filters: { where: { id: { _eq: id } } },
            values: { confirm_code: confirm_code },
          })
        )
      })
    )
    const eventsByOrganizer = events.reduce(
      (groups, event) => ({
        ...groups,
        [event.organizer_id]: [...(groups[event.organizer_id] || []), event],
      }),
      {}
    )
    const fetchEmails = Object.keys(eventsByOrganizer).map(id =>
      sudo(select('auth0', { filters: { id }, fields: ['id', 'email'] })).then(
        ({ auth0 }) => auth0
      )
    )

    Promise.all(fetchEmails).then(results =>
      results.map(({ id, email }) => {
        const organizerEvents = eventsByOrganizer[id]
        console.log(
          `Reminder email sent to ${email} for the following events: ${organizerEvents
            .map(e => `'${e.name}'`)
            .join(', ')}`
        )
        send({
          to: email,
          subject: 'Semi-annual check-in from BadukClub',
          text:
            `
Hello from BadukClub!

It's been about 6 months since you last updated some of your meetup information, so
we thought we'd check in and make sure everything is up-to-date. We do this check
to ensure that BadukClub remains a high-quality source for Go meetups around the world.

If everything is still the same, click the 'Still the same' links below to confirm with
us. Otherwise, please log in to BadukClub and edit the meetup information accordingly.
We've provided links directly to the meetups in question for your convenience.

` +
            organizerEvents
              .map(
                ({ name, confirm_code, id }) =>
                  `${name}:

Still the same: ${process.env.APP_DOMAIN}/events/${id}/refresh?code=${confirm_code}

Needs a change: ${process.env.APP_DOMAIN}/events/${id}`
              )
              .join('\n\n') +
            `

Thank you for using BadukClub!

Cheers,

BadukClub admins

P.S.: Feel free to reply to this message with questions or concerns.
`,
        })
      })
    )
  })
}
