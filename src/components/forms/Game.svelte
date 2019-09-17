<script>
  import { createEventDispatcher } from 'svelte'
  import Typeahead from '/components/input/Typeahead'
  import Icon from '/components/Icon'

  const dispatch = createEventDispatcher()

  export let initial = {
    black: {},
    white: {},
    komi: 0,
    handicap: 0,
    winner: true,
    id: 'new',
  }
  export let players = []

  let game, refresh

  const reset = () => {
    game = JSON.parse(JSON.stringify(initial))
    refresh ^= true
  }
  reset()

  let playerSelectProps = {
    errorMessage: 'Please select a player from the list',
    key: 'name',
  }
  let lists = { black: players, white: players }

  const set = (p, { detail: { result } }) => (game[p] = result)
  const clear = p => (game[p] = {})
  const setList = (p, id) => (lists[p] = players.filter(o => o.id !== id))

  $: setList('black', game.white.id)
  $: setList('white', game.black.id)
  $: disabled = !(
    game.black.id &&
    game.white.id &&
    JSON.stringify(initial) !== JSON.stringify(game)
  )

  function submit() {
    dispatch('submit', { game })
    reset()
  }
</script>

<style>
  label:not(.stat) {
    @apply opacity-0 rounded-sm bg-gray-300 ml-4 px-3 py-2;
  }

  .player:hover > label:not(.winner):not(:hover) {
    @apply opacity-50;
  }

  label:not(.stat):hover,
  label.winner {
    @apply opacity-100 cursor-pointer;
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

  button:disabled {
    @apply cursor-not-allowed opacity-25;
  }
</style>

<div class="flex items-center w-full">
  <div class="flex-1 flex flex-col items-center justify-center">
    {#each ['white', 'black'] as player}
      <div data-cy={player} class="flex items-center my-4 player">
        <div class="mr-2">
          <Icon id="circle" fill={player} />
        </div>
        <Typeahead
          placeholder="{player} player name"
          {refresh}
          id={player}
          on:select={e => set(player, e)}
          on:clear={() => clear(player)}
          initial={initial[player].name}
          items={lists[player]}
          {...playerSelectProps} />
        <label
          for="{player}-won-{game.id}"
          class:winner={(player === 'white') === game.winner}>
          <input
            type="radio"
            id="{player}-won-{game.id}"
            class="mr-4 hidden"
            bind:group={game.winner}
            value={player === 'white'} />
          <span class="text-xs">won the game</span>
        </label>
      </div>
    {/each}
  </div>
  <div class="flex-0 flex justify-around items-center w-56">
    <label for="komi" class="stat">
      <input
        type="number"
        class="number bg-transparent"
        bind:value={game.komi}
        id="komi" />
      <span class="label -ml-3">komi</span>
    </label>
    <label for="handicap" class="stat">
      <input
        type="number"
        class="number bg-transparent"
        bind:value={game.handicap}
        id="handicap" />
      <span class="label -ml-3">handicap</span>
    </label>
  </div>
</div>
<hr class="my-4" />
<div class="w-full flex items-center justify-between my-5">
  <button
    on:click={reset}
    data-cy="game-form-reset"
    class="px-4 py-2 border-2 border-gray-800 rounded">
    Reset
  </button>
  <button
    on:click={submit}
    data-cy="game-form-submit"
    {disabled}
    class="bg-gray-700 text-white px-4 py-2 rounded">
    Submit
  </button>
</div>
