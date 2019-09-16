import gql_str from './gql-str'

const tables = ['events', 'attendances', 'users', 'games', 'auth0']

const to_gql_str_object = ({ root, type, filters, values, fields }) =>
  !type || type === 'select'
    ? { type: 'query', root, params: filters, fields }
    : {
        type: 'mutation',
        root: `${type}_${root}`,
        params: {
          ...filters,
          ...(values
            ? type === 'insert'
              ? { objects: values }
              : { _set: values }
            : {}),
        },
        fields: fields ? { returning: fields } : ['affected_rows'],
      }

const create_string = ({ root, ...opts }) =>
  tables.indexOf(root) === -1
    ? JSON.stringify({ error: `invalid table "${root}"` })
    : gql_str(to_gql_str_object({ root, ...opts }))

export const execute = async (
  {
    query,
    variables = null,
    token,
    headers = {},
    endpoint = process.env.DATABASE_ENDPOINT,
    extractJSON = r => r.json(),
  },
  f = fetch
) =>
  f(endpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(process.env.NODE_ENV === 'development' && !token
        ? { 'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET }
        : {}),
      ...headers,
    },
    body: JSON.stringify({ query: query.replace(/\s+/g, ' '), variables }),
  })
    .then(extractJSON)
    .then(({ data, errors }) => {
      return errors
        ? Promise.reject(
            new Error(`Database Error: ${errors.map(e => e.message).join(',')}`)
          )
        : data
    })

export const del = (root, options) =>
  create_string({ root, type: 'delete', ...options })
export const update = (root, options) =>
  create_string({ root, type: 'update', ...options })
export const select = (root, options) =>
  create_string({ root, type: 'select', ...options })
export const create = (root, options) =>
  create_string({ root, type: 'insert', ...options })

export const merge = ops => gql_str(...ops.map(to_gql_str_object))
