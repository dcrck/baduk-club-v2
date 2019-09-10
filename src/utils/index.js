export function debounce(callback, wait) {
  let timeout = null
  const root = window

  const useRAF =
    !wait && wait !== 0 && typeof root.requestAnimationFrame === 'function'

  const startTimer = (pendingFunc, wait) => {
    if (useRAF) {
      root.cancelAnimationFrame(timeout)
      return root.requestAnimationFrame(pendingFunc)
    }
    return setTimeout(pendingFunc, wait)
  }

  const cancelTimer = id =>
    useRAF ? root.cancelAnimationFrame(id) : clearTimeout(id)

  return (...args) => {
    const next = () => callback(...args)
    cancelTimer(timeout)
    timeout = startTimer(next, wait)
  }
}
