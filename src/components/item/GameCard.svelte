<script>
  import Icon from '/components/Icon'
  import parse from './parsing'
  export let border = false
  export let winner, black, white, komi, handicap, id, recorded
  export let event = null

  $: players = { black, white }
  $: parsed = parse({ recorded })
  const isWinner = p => ('white' === p) === winner
</script>

<style>
  .game-card {
    @apply rounded-lg bg-white p-4 flex flex-wrap justify-center items-center shadow-xl;
  }
  .game-card.border {
    @apply shadow-none border border-gray-400;
  }
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
  data-cy="game-card"
  id="game-card-{id}"
  class="game-card flex-col md:flex-row"
  class:border>
  <div class="flex-1 flex flex-col items-center justify-center">
    <div class="flex justify-baseline">
      <div class="flex flex-col justify-center items-center my-4">
        {#each ['white', 'black'] as player}
          <div data-cy={player} class="flex items-center">
            <div class="mr-2">
              <Icon id="circle" fill={player} />
            </div>
            <a
              href="users/{players[player].id}"
              rel="prefetch"
              target="_blank"
              class="text-xl hover:underline">
              {players[player].name}
            </a>
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
          <span
            class="winner"
            data-cy="winner-white"
            style="margin-top: -0.4rem">
            winner
          </span>
        {:else}
          <span
            class="winner"
            data-cy="winner-black"
            style="margin-bottom: -0.4rem">
            winner
          </span>
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
  <div class="w-full" data-cy="event-link">
    <hr class="mt-2 mb-4" />
    <p class="text-sm text-center text-gray-500 italic">
      played {parsed.recorded} ago
      {#if event}
        at
        <a
          rel="prefetch"
          href="events/{event.id}"
          class="hover:underline text-blue-500">
          {event.name}
        </a>
      {/if}
    </p>
  </div>
</div>
