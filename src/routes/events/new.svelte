<script context="module">
  export async function preload({ path }, { user }) {
    if (!user) return this.redirect(`login?redir=${path}`)
    if (!user.email_verified) return this.redirect('/')
    return { user }
  }
</script>

<script>
  import NewEventForm from '/components/forms/NewEvent'
  import { goto } from '@sapper/app'
</script>

<svelte:head>
  <title>Create a new Meetup | BadukClub</title>
</svelte:head>

<NewEventForm on:cancel={() => goto('/')} />
