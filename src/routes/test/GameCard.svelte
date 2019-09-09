<script>
  import GameCard from '/components/item/GameCard'

  const players = {
    black: { name: 'Derek' },
    white: { name: 'Devin' },
  }
  const whiteWins = {
    winner: true,
    ...players,
    komi: 15,
    handicap: 22,
  }

  const blackWins = {
    ...whiteWins,
    winner: false,
  }

  const withEventInfo = {
    ...blackWins,
    event: {
      name: 'Go Event Name',
      id: '1',
    },
  }
</script>

<div class="my-8" data-cy="game-card-white">
  <GameCard {...whiteWins} />
</div>
<div class="my-8" data-cy="game-card-black">
  <GameCard {...blackWins} />
</div>
<div class="my-8" data-cy="game-card-event">
  <GameCard {...withEventInfo} />
</div>
