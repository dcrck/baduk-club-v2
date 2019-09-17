<script>
  import { toastKey } from '/utils/index'
  import { getContext } from 'svelte'

  const { ping } = getContext(toastKey)

  const messages = {
    danger:
      'Oops! Looks like we had trouble adding the event to the database. Please try again or contact support if this issue persists.',
    success: 'Event added successfully!',
    warning:
      'Hmmm, looks like there may be a problem here in the future. Let us know if you have any problems',
    info: 'A simple info message to help you out!',
    default: 'Derek invited you to an event',
  }
  const show = type =>
    ping({
      message: messages[type],
      debug:
        type === 'danger' || type === 'warning'
          ? `Loading failed for the <script> with source “https://cdn.simpleanalytics.io/hello.js”.`
          : '',
      type,
      duration: 5000,
    })
</script>

{#each ['danger', 'success', 'warning', 'info', 'default'] as type}
  <button
    on:click={() => show(type)}
    class="block py-2 px-3 bg-gray-300 border border-gray-800">
    {type}
  </button>
{/each}
