<script context="module">
  export async function preload({ path }, { user }) {
    return user ? { user } : this.redirect(`login?redir=${path}`)
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
