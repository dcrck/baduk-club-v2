<script>
  import EventForm from '/components/forms/Event'
  import { merge, execute } from '/api/db/index'
  import { goto, stores } from '@sapper/app'
  import generate from 'nanoid/generate'
  const { session } = stores()
  let { user } = $session

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
      .then(() => goto(`events/${id}`))
      .catch(e => alert(e))
  }
</script>

<EventForm on:submit={submit} on:cancel />
