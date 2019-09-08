<script>
  import Modal from '/components/Modal'
  let open = false
  const toggle = () => (open ^= true)
</script>

<button on:click={toggle} data-cy="show-modal">Open Modal</button>

{#if open}
  <Modal on:close={toggle}>
    <div class="p-8 rounded-lg" data-cy="card">
      <span>This is a test!</span>
    </div>
  </Modal>
{/if}
