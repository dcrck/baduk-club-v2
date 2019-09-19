import { machine } from '/utils/state'
import { newAttendance } from '/api/db/helpers'
import { execute, del } from '/api/db/index'
const state_config = {
  states: {
    organizer: {
      on: {
        CHECK_IN: 'here',
        //SWITCH: 'attendee',
      },
    },
    attendee: {
      on: {
        CHECK_IN: 'here',
        CANCEL: 'visitor',
      },
    },
    visitor: {
      on: {
        SIGN_UP: 'attendee',
      },
    },
    here: {},
  },
}

export const buttonConfig = canCheckIn => ({
  visitor: { icon: 'user-check', text: 'Sign Up', msg: 'SIGN_UP' },
  here: {},
  ...(canCheckIn
    ? {
        organizer: { icon: 'map-pin', text: 'Check In', msg: 'CHECK_IN' },
        attendee: { icon: 'map-pin', text: 'Check In', msg: 'CHECK_IN' },
      }
    : {
        //organizer: { icon: '', text: 'Switch Organizer', msg: 'SWITCH' },
        attendee: { icon: 'user-x', text: 'Cancel Attendance', msg: 'CANCEL' },
      }),
})

const signUp = (user_id, event_id, token) =>
  execute({ token, query: newAttendance(user_id, event_id) }).then(
    ({
      insert_attendances: {
        returning: [attendance],
      },
    }) => attendance
  )

const cancelAttendance = (user_id, event_id, token) =>
  execute({
    token,
    query: del('attendances', {
      filters: {
        where: {
          _and: [
            { user_id: { _eq: user_id } },
            { event_id: { _eq: event_id } },
          ],
        },
      },
    }),
  }).then(({ delete_attendances: { affected_rows } }) => affected_rows)

const switchOrganizer = () => Promise.resolve()
const checkIn = () => Promise.resolve()

const actions = (...args) => ({
  SIGN_UP: () => signUp(...args),
  CANCEL: () => cancelAttendance(...args),
  SWITCH: () => switchOrganizer(...args),
  CHECK_IN: () => checkIn(...args),
})

export default (init, { user_id, event_id, token }) => ({
  state: machine({ init, ...state_config }),
  actions: actions(user_id, event_id, token),
})

export const send = (state, actions, msg, updateUI = () => {}) => {
  actions[msg] && actions[msg]().then(updateUI)
  state.send(msg)
}
