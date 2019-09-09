<script>
  import Icon from '/components/Icon'
  export let border = false

  export let winner, black, white, komi, handicap
  export let event

  $: players = { black, white }
  const isWinner = p => ('white' === p) === winner
</script>

<style>
  .stat {
    @apply flex flex-col items-center;
  }

  .stat > .number {
    @apply text-3xl font-light w-16 text-center;
  }

  .stat > .label {
    @apply text-sm;
  }

  span.winner {
    @apply px-3 py-2 rounded italic bg-gray-300;
  }
</style>

<div
  class="rounded-lg bg-white {border ? 'border border-gray-400' : 'shadow-xl'}
  p-4 flex flex-wrap items-center">
  <div class="flex-1 flex flex-col items-center justify-center">
    <div class="flex justify-baseline">
      <div class="flex flex-col justify-center items-center my-4">
        {#each ['white', 'black'] as player}
          <div data-cy={player} class="flex items-center">
            <div class="mr-2">
              <Icon id="circle" fill={player} />
            </div>
            <span class="text-xl">{players[player].name}</span>
          </div>
          {#if player === 'white'}
            <span class="my-4 flex-1">vs.</span>
          {/if}
        {/each}
      </div>
      <div
        class="flex-0 flex flex-col {isWinner('white') ? 'justify-start' : 'justify-end'}
        ml-4 my-4">
        {#if winner}
          <span class="winner" data-cy="winner-white" style="margin-top: -0.4rem">winner</span>
        {:else}
          <span class="winner" data-cy="winner-black" style="margin-bottom: -0.4rem">winner</span>
        {/if}
      </div>
    </div>
  </div>
  <div class="flex-0 flex justify-around items-center w-56">
    <div class="stat" data-cy="game-card-komi">
      <span class="number -ml-3">{komi}</span>
      <span class="label -ml-3">komi</span>
    </div>
    <div class="stat" data-cy="game-card-handicap">
      <span class="number -ml-3">{handicap}</span>
      <span class="label -ml-3">handicap</span>
    </div>
  </div>
  {#if event}
    <div class="w-full" data-cy="event-link">
      <hr class="mt-2 mb-4" />
      <p class="text-sm text-center">
        at
        <a href="events/{event.id}" class="hover:underline text-blue-500">
          {event.name}
        </a>
      </p>
    </div>
  {/if}
</div>
