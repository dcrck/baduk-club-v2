import { merge } from '/api/db/index'

export const profileData = id =>
  merge([
    {
      root: 'games',
      type: 'select',
      filters: {
        where: { _or: [{ black: { _eq: id } }, { white: { _eq: id } }] },
      },
      fields: {
        _: ['komi', 'winner', 'handicap'],
        black_player: ['name', 'rank', 'id'],
        white_player: ['name', 'rank', 'id'],
        event: ['name', 'id'],
      },
    },
    {
      root: 'users',
      type: 'select',
      filters: { where: { id: { _eq: id } }, limit: 1 },
      fields: {
        _: ['id', 'rank', 'name', 'phone', 'picture'],
        events: ['id', 'name', 'times', 'address'],
        attendances: {
          event: ['id', 'name', 'times', 'address', 'organizer_id'],
        },
      },
    },
  ])
