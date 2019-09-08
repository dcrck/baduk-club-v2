import {
  execute,
  create,
  del,
  update,
  select,
  merge,
} from '../../../src/api/db/index'

describe('database query generator', () => {
  it('generates simple select query', () => {
    const actual = select('events', {
      fields: ['address', 'description', 'geolocation', 'id', 'name', 'times'],
    })
    const expected = `query q { events { address, description, geolocation, id, name, times } }`
    expect(actual).to.equal(expected)
  })

  it('rejects selects from unrecognized tables', () => {
    const { error } = JSON.parse(select('evens', { fields: ['id'] }))
    const expected = `invalid table "evens"`
    expect(error).to.equal(expected)
  })

  it('generates select query with filters', () => {
    const actual = select('events', {
      filters: { where: { id: { _eq: '1' } }, limit: 1 },
      fields: ['id', 'name'],
    })

    const expected = `query q { events(where: { id: { _eq: "1" } }, limit: 1) { id, name } }`
    expect(actual).to.equal(expected)
  })

  it('realistic select query (nested + base fields)', () => {
    const actual = select('users', {
      fields: {
        _: ['id', 'rank', 'name', 'phone'],
        events: ['id', 'name', 'times', 'address'],
        attendances: {
          event: ['id', 'name', 'times', 'address', 'organizer_id'],
        },
      },
    })
    const expected = `query q {
      users {
        id,
        rank,
        name,
        phone,
        events {
          id,
          name,
          times,
          address
        },
        attendances {
          event {
            id,
            name,
            times,
            address,
            organizer_id
          }
        }
      }
    }`.replace(/\s+/g, ' ')
    expect(actual).to.equal(expected)
  })

  it('generates simple delete query', () => {
    const actual = del('events', {
      filters: { where: { id: { _eq: '1' } } },
      fields: ['id', 'name'],
    })

    const expected = `mutation m { delete_events(where: { id: { _eq: "1" } }) { returning { id, name } } }`

    expect(actual).to.equal(expected)
  })

  it('generates delete query with no fields specified', () => {
    const actual = del('events', { filters: { where: { id: { _eq: '1' } } } })

    const expected = `mutation m { delete_events(where: { id: { _eq: "1" } }) { affected_rows } }`

    expect(actual).to.equal(expected)
  })

  it('generates simple update query', () => {
    const actual = update('events', {
      filters: { where: { id: { _eq: '1' } } },
      values: { name: 'New Name' },
      fields: ['name'],
    })

    const expected = `mutation m {
      update_events(where: { id: { _eq: "1" } }, _set: { name: "New Name" }) {
        returning {
          name
        }
      }
    }`.replace(/\s+/g, ' ')

    expect(actual).to.equal(expected)
  })

  it('generates a simple insert query', () => {
    const actual = create('events', {
      values: { id: 'test-test-test', name: 'test event' },
      fields: ['id'],
    })

    const expected = `mutation m {
      insert_events(objects: { id: "test-test-test", name: "test event" }) {
        returning {
          id
        }
      }
    }`.replace(/\s+/g, ' ')

    expect(actual).to.equal(expected)
  })

  it('does not generate combined query (mutation + select)', () => {
    const actual = merge([
      {
        root: 'events',
        type: 'update',
        filters: { where: { id: { _eq: '1' } } },
        values: { name: 'New Name' },
        fields: ['name'],
      },
      {
        root: 'events',
        filters: { where: { id: { _eq: '1' } } },
        fields: ['name'],
      },
    ])

    const { error } = JSON.parse(actual)

    expect(error).to.equal('Cannot combine mutation and query in one request')
  })

  it('generates combined queries (multiple selects)', () => {
    const actual = merge([
      {
        root: 'events',
        filters: { where: { id: { _eq: '1' } } },
        fields: ['name'],
      },
      {
        root: 'users',
        filters: { where: { id: { _eq: '1' } } },
        fields: ['name'],
      },
    ])

    const expected = `query q {
      events(where: { id: { _eq: "1" } }) {
        name
      },
      users(where: { id: { _eq: "1" } }) {
        name
      }
    }`.replace(/\s+/g, ' ')

    expect(actual).to.equal(expected)
  })
})

describe('database interface', () => {
  const cyreq = (endpoint, options) =>
    cy.request({ url: endpoint, ...options, failOnStatusCode: true })
  const headers = {
    'x-hasura-admin-secret': Cypress.env('HASURA_ADMIN_SECRET'),
  }
  const gql = q =>
    execute(
      {
        query: q,
        headers,
        endpoint: Cypress.env('DATABASE_ENDPOINT'),
        extractJSON: r => r.body,
      },
      cyreq
    )
  it('executes a query successfully', () => {
    const query = select('events', {
      fields: ['id', 'name'],
      filters: { limit: 1 },
    })
    gql(query).catch(errors => expect(errors).to.be.undefined)
  })
  it('executes several mutations successfully', () => {
    const ev = {
      geolocation: { lat: 41.4546105, lng: -81.34572100000003 },
      times: [
        {
          start: '2019-04-01T00:00:00.000Z',
          end: '2019-04-01T02:00:00.000Z',
          rrule: 'FREQ=WEEKLY;BYDAY=SU',
        },
      ],
      id: 'test-test-test',
      is_private: true,
      name: 'test-meetup',
      description: encodeURIComponent('test description\n'),
      address: '15198 Hook Hollow Road, Novelty, OH, USA',
      organizer_id: 'auth0|5d292b2638fa460d2df45c09',
    }

    const createEvent = {
      type: 'insert',
      root: 'events',
      fields: ['id'],
      values: ev,
    }
    const deleteEvent = {
      type: 'delete',
      root: 'events',
      filters: { where: { id: { _eq: 'test-test-test' } } },
    }

    const query = merge([createEvent, deleteEvent])

    gql(query).catch(errors => expect(errors).to.be.undefined)
  })
})
