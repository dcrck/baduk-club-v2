import gql_str from '../../../src/api/db/gql-str'

describe('query string generator', () => {
  it('generates simple query string', () => {
    const input = {
      type: 'query',
      root: 'events',
      fields: ['address', 'description', 'geolocation', 'id', 'name', 'times'],
    }
    const expected = `query q { events { address, description, geolocation, id, name, times } }`

    expect(gql_str(input)).to.equal(expected)
  })

  it('generates select query by default', () => {
    const input = {
      root: 'events',
      fields: ['address', 'description', 'geolocation', 'id', 'name', 'times'],
    }
    const expected = `query q { events { address, description, geolocation, id, name, times } }`
    expect(gql_str(input)).to.equal(expected)
  })

  it('generates nested return fields', () => {
    const input = {
      root: 'events',
      fields: { organizer: ['name', 'id'] },
    }
    const expected = `query q { events { organizer { name, id } } }`

    expect(gql_str(input)).to.equal(expected)
  })

  it('generates query with simple parameters', () => {
    const input = {
      root: 'events',
      params: { id: '1', is_public: false },
      fields: ['id', 'is_public'],
    }

    const expected = `query q { events(id: "1", is_public: false) { id, is_public } }`
    expect(gql_str(input)).to.equal(expected)
  })

  it('generates query with nested parameters', () => {
    const input = {
      root: 'events',
      params: {
        object: {
          _is: { _deeply: { _nested: { id: '1', is_public: false } } },
        },
      },
      fields: ['id'],
    }

    const expected = `query q { events(object: { _is: { _deeply: { _nested: { id: "1", is_public: false } } } }) { id } }`
    expect(gql_str(input)).to.equal(expected)
  })

  it('generates query with array parameters', () => {
    const params = {
      geolocation: { lat: 50, lng: 50 },
      id: 'test-test-test',
      is_private: false,
    }

    const input = {
      root: 'insert_events',
      type: 'mutation',
      params: { objects: [params] },
      fields: { returning: ['id'] },
    }

    const expected = `mutation m {
        insert_events(objects: [{
          geolocation: { lat: 50, lng: 50 },
          id: "${params.id}",
          is_private: ${params.is_private}
        }]) {
          returning {
            id
          }
        }
      }`.replace(/\s+/g, ' ')
    expect(gql_str(input)).to.equal(expected)
  })

  it('generates queries with null parameter values', () => {
    const params = {
      id: 'test-test-test',
      phone: null,
    }

    const input = {
      root: 'insert_users',
      type: 'mutation',
      params: { objects: [params] },
      fields: { returning: ['id'] },
    }

    const expected = `mutation m {
        insert_users(objects: [{
          id: "${params.id}",
          phone: null
        }]) {
          returning {
            id
          }
        }
      }`.replace(/\s+/g, ' ')

    expect(gql_str(input)).to.equal(expected)
  })

  it('supports queries from multiple tables', () => {
    const input = [
      { root: 'events', fields: ['id', 'name'] },
      { root: 'attendances', fields: ['id'] },
    ]

    const expected = `query q {
      events {
        id,
        name
      },
      attendances {
        id
      }
    }`.replace(/\s+/g, ' ')

    expect(gql_str(...input)).to.equal(expected)
  })

  it('does not mutations + queries in the same string', () => {
    const params = {
      geolocation: { lat: 50, lng: 50 },
      id: 'test-test-test',
      is_private: false,
    }
    const input = [
      { root: 'events', fields: ['id', 'name'] },
      {
        root: 'insert_events',
        type: 'mutation',
        params: { objects: [params] },
        fields: { returning: ['id'] },
      },
    ]

    const { error } = JSON.parse(gql_str(...input))

    expect(error).to.equal('Cannot combine mutation and query in one request')
  })

  it('supports nested + non-nested fields in the same string', () => {
    const input = [
      {
        root: 'events',
        fields: { _: ['name', 'id'], organizer: { test: ['name', 'id'] } },
      },
    ]

    const expected = `query q {
      events {
        name,
        id,
        organizer {
          test {
            name, id
          }
        }
      }
    }`.replace(/\s+/g, ' ')

    expect(gql_str(...input)).to.equal(expected)
  })
})
