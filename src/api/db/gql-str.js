function field_str(fields) {
  if (Array.isArray(fields)) {
    return fields.join(', ')
  } else if (typeof fields === 'object') {
    return Object.entries(fields)
      .map(([k, v]) =>
        k === '_'
          ? `${field_str(Object.values(v))}`
          : `${k} { ${field_str(v)} }`
      )
      .join(', ')
  }
  return fields
}

function parse_param_val(value) {
  if (Array.isArray(value)) return `[${param_str(value)}]`
  if (value === null) return 'null'
  if (typeof value === 'object') return `{ ${param_str(value)} }`
  if (typeof value === 'string') return `"${value}"`
  else return `${value}`
}

const param_str = params =>
  Object.entries(params)
    .map(
      ([key, value]) => (isNaN(+key) ? `${key}: ` : '') + parse_param_val(value)
    )
    .join(', ')

const parse_root = ({ root, fields, params }) =>
  `${root}${params ? `(${param_str(params)})` : ''} {
    ${field_str(fields)}
  }`.replace(/\s+/g, ' ')

const generate_string = (type, roots) =>
  `${type} ${type[0]} {
    ${roots.map(parse_root).join(',\n')}
  }`
    .replace(/\s+/g, ' ')
    .trim()

const choose_and_generate = (queries, mutations) =>
  queries.length && mutations.length
    ? JSON.stringify({
        error: 'Cannot combine mutation and query in one request',
      })
    : queries.length
    ? generate_string('query', queries)
    : generate_string('mutation', mutations)

export default (...queries) =>
  choose_and_generate(
    queries.filter(q => !q.type || q.type === 'query'),
    queries.filter(q => q.type === 'mutation')
  )
