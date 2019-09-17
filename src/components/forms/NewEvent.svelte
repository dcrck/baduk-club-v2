<script>
  import EventForm from '/components/forms/Event'
  import { merge, execute } from '/api/db/index'
  import { goto, stores } from '@sapper/app'
  import generate from 'nanoid/generate'
  import { toastKey } from '/utils/index'
  import { getContext } from 'svelte'
  const { session } = stores()

  let { user } = $session
  const { ping } = getContext(toastKey)

  function submit({ detail: { data: evt } }) {
    const id = generate('0123456789abcdefghijklmnopqrstuvwxyz', 10)

    return execute({
      query: merge([
        {
          root: 'events',
          type: 'insert',
          values: { ...evt, id },
        },
        {
          root: 'attendances',
          type: 'insert',
          values: {
            event_id: id,
            user_id: user.id,
            paid: true,
            confirmed: true,
            notify: true,
          },
        },
      ]),
      token: user.token,
    })
      .then(() => {
        ping({ message: 'Event created successfully!', type: 'success' })
        return goto(`events/${id}`)
      })
      .catch(e =>
        ping({
          message:
            'Oops! Looks like we had trouble adding the event to the database. Please try again or contact support if this issue persists.',
          debug: e,
          type: 'danger',
          duration: 10000,
        })
      )
  }
</script>

<EventForm on:submit={submit} on:cancel />
