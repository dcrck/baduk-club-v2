function getRoot() {
  if (typeof window !== 'undefined') {
    return window
  } else if (typeof global !== 'undefined') {
    return global
  } else if (typeof self !== 'undefined') {
    return self
  } else {
    return {}
  }
}

export function debounce(callback, wait) {
  let timeout = null
  const root = getRoot()

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

export const toastKey = {}
