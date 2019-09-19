<script>
  //import Icon from './Icon.svelte'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const close = () => dispatch('close')
</script>

<style>
  .content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow-y: scroll;
    max-height: calc(100vh - 4rem);
    max-width: calc(100vw - 4rem);
    min-width: 50%;
  }
</style>

<div data-cy="modal">
  <div
    data-cy="modal-background"
    class="fixed top-0 left-0 w-screen h-screen bg-black opacity-50"
    style="z-index: 999"
    on:click={close} />

  <div class="fixed bg-white content p-8 rounded" style="z-index: 999">
    <slot />
    <!--<button
      class="m-2 hover:opacity-100 opacity-50 absolute top-0 right-0"
      data-cy="close-modal"
      on:click={close}>
      <Icon id="x" />
    </button>-->
  </div>
</div>
