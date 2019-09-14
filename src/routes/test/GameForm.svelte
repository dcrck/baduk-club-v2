<script>
  import GameForm from '/components/forms/Game'
  import GameCard from '/components/item/GameCard'
  let games = []

  let players = [
    { name: 'Devin', id: 1 },
    { name: 'Derek', id: 2 },
    { name: 'Rachel', id: 3 },
    { name: 'David', id: 4 },
  ]

  let event = {
    id: 1,
    name: 'Test Event Name',
  }

  function addGame({ detail: { game } }) {
    games = [...games, game]
  }
</script>

<GameForm on:submit={addGame} {players} />

{#each games as g}
  <div class="my-4">
    <GameCard {...g} {event} />
  </div>
{/each}
