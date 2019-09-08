<script>
  import Segments from '/components/Segments'
  let choices = ['first', 'second', 'third']
  let other_choices = [
    { name: 'fifth', icon: 'heart' },
    { name: 'sixth', icon: 'moon' },
    { name: 'seventh', icon: 'at-sign' },
  ]
  let tab

  const choose = ({ detail: { choice } }) => (tab = choice)
</script>

<Segments {choices} on:change={choose} />

<div data-cy="segment-content">
  {#if tab === 'first'}
    <span>This is the first group</span>
  {:else if tab === 'second'}
    <span>This is the second group</span>
  {:else if tab === 'third'}
    <span>This is the third group</span>
  {:else}
    <span>default</span>
  {/if}
</div>

<Segments choices={other_choices} on:change={choose} />
