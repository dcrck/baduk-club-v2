<script>
  import LocationSearch from '/components/input/LocationSearch'

  let evt = {
    address: '',
    geolocation: undefined,
  }
  const onSelect = ({ detail }) => (evt = { ...evt, ...detail })
  const clearLocation = () =>
    (evt = { ...evt, address: undefined, geolocation: undefined })
</script>

<label for="address" class="form-label">
  Address
  <LocationSearch
    id="address"
    initial={evt.address}
    on:select={onSelect}
    on:clear={clearLocation}
    placeholder="Where are you meeting? (start typing!)" />
</label>
