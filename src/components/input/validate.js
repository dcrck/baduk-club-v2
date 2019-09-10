export const initialize = (initial, error) => ({
  status: error(initial) ? 'initial' : 'ok',
})

const error = e => ({ status: 'error', error: e })
const ok = () => ({ status: 'ok' })

export const load = processing => ({
  status: processing ? 'loading' : 'initial',
})

const decide = e => (e ? error(e) : ok())

export default (shouldCheck, isError, value) =>
  shouldCheck ? decide(isError(value)) : null
