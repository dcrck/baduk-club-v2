import { writable } from 'svelte/store'
export const machine = ({ init, states }) => {
  if (!init) throw new Error(`That isn't a state, choose a real init state!`)
  let current_state = init
  const { subscribe, set } = writable(current_state)

  const send = event => {
    if (!states[current_state].on[event]) {
      console.log('no such event')
      return
    }

    if (!states[states[current_state].on[event]]) {
      console.log('no such state')
      return
    }
    current_state = states[current_state].on[event]
    set(current_state)
  }

  return {
    subscribe,
    send,
  }
}
