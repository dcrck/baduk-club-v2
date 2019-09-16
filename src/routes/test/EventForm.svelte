<script context="module">
  export async function preload(page, { user }) {
    return { user }
  }
</script>

<script>
  import EventForm from '/components/forms/Event'
  import { create, update, execute } from '/api/db/index'
  import generate from 'nanoid/generate'
  export let user

  const id = generate('0123456789abcdefghijklmnopqrstuvwxyz', 21)

  let initial = {
    address: '',
    times: [],
    name: '',
    is_private: false,
    description: '',
    geolocation: null,
  }

  const submit = ({ detail: { data } }) =>
    execute({
      query: initial.name
        ? update('events', {
            filters: { where: { id: { _eq: id } } },
            values: data,
          })
        : create('events', { values: { ...data, id, organizer_id: user.id } }),
    }).then(() => {
      console.log({ ...initial, ...data })
      initial = { ...initial, ...data }
    })
</script>

{#if user}
  <div data-cy="event-form">
    <EventForm {initial} on:submit={submit} />
  </div>
{:else}
  <div data-cy="unauthorized">
    <p>Cannot access this form, please login to do so</p>
  </div>
{/if}
