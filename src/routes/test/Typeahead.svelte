<script>
  import Typeahead from '/components/input/Typeahead'

  let props = {
    items: [
      { name: 'Derek', id: 1 },
      { name: 'Devin', id: 2 },
      { name: 'Rachel', id: 3 },
      { name: 'David', id: 4 },
    ],
    key: 'name',
    placeholder: 'Player',
  }
</script>

<Typeahead {...props} />
