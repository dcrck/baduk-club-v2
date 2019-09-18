<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import Validation from '/components/input/Validation'
  import check, { initialize, load } from '/components/input/validate'
  import { debounce } from '/utils/index'

  export let initial = { picture: '', phone: '', name: '', rank: '' }
  export let resetOnSubmit = false
  const dispatch = createEventDispatcher()

  let current, state, validImage, url
  let validateImageURL = () => {}
  let debouncedImageValidation = () => {}

  let error = {
    name: n => (!n ? 'Please enter your name' : ''),
    rank: r => (!r ? 'Please enter your rank (default: 25k)' : ''),
    picture: () => (!validImage ? 'Please enter a valid image URL' : ''),
  }

  function reset() {
    current = JSON.parse(JSON.stringify(initial))
    validImage = !!current.picture
    url = validImage ? current.picture : ''
    state = Object.keys(error).reduce(
      (obj, k) => ({
        ...obj,
        [k]: initialize(current[k], error[k]),
      }),
      {}
    )
  }

  reset()
  $: reset(initial)

  function submit() {
    if (disabled) return
    dispatch('submit', { data: current })
    if (resetOnSubmit) reset()
  }

  function cancel() {
    dispatch('cancel')
    reset()
  }

  function validate(k, first = false) {
    state[k] =
      check(first || state[k].status !== 'initial', error[k], current[k]) ||
      state[k]
  }

  $: if (current) {
    validate('name')
    validate('rank')
  }

  $: if (current.picture !== url) {
    state.picture = load(true)
    debouncedImageValidation(current.picture)
  }

  onMount(() => {
    const img = new Image()
    function imageLoaded(isValid, _url = '') {
      validImage = isValid
      url = _url
      validate('picture')
    }

    validateImageURL = url => {
      img.onload = () => imageLoaded(true, url)
      img.onerror = () => imageLoaded(false)
      img.src = url
    }
    debouncedImageValidation = debounce(validateImageURL, 400)
  })

  $: disabled = !(
    JSON.stringify(initial) !== JSON.stringify(current) &&
    !Object.keys(error).find(k => state[k].status !== 'ok')
  )
</script>

<style>
  .form-input {
    @apply px-3 py-2 border rounded border-gray-400;
  }

  .form-input:focus {
    @apply border-gray-800;
  }

  img::before {
    @apply absolute left-0;
    top: 50%;
    transform: translateY(-50%);
  }
</style>

<div class="mt-4 mb-8">
  <label for="name" class="form-label">
    Name
    <Validation {...state.name}>
      <input
        type="text"
        id="name"
        data-cy="name-input"
        class="form-input w-full"
        bind:value={current.name}
        on:blur={() => validate('name', true)} />
    </Validation>
  </label>
</div>

<div class="mt-4 mb-8">
  <label for="rank" class="form-label">
    Rank
    <Validation {...state.rank}>
      <input
        type="text"
        id="rank"
        data-cy="rank-input"
        class="form-input w-full"
        bind:value={current.rank}
        on:blur={() => validate('rank', true)} />
    </Validation>
  </label>
</div>

<div class="mt-4 mb-8">
  <label for="phone" class="form-label">
    Phone Number
    <input
      id="phone"
      type="tel"
      class="form-input w-full"
      bind:value={current.phone}
      placeholder="+12168675309" />
  </label>
</div>

<div class="mt-4 mb-8">
  <label for="picture" class="form-label">
    Photo
    <Validation {...state.picture}>
      <input
        type="url"
        id="picture"
        data-cy="picture-input"
        class="form-input w-full"
        bind:value={current.picture}
        on:blur={() => validate('picture', true)} />
    </Validation>
    <div class="italic text-sm text-center">
      <img
        src={url}
        alt="Invalid image location"
        class="rounded-full w-32 h-32 bg-gray-300 mx-auto relative my-4" />
    </div>
  </label>
</div>

<div class="flex items-center justify-between">
  <button
    data-cy="cancel-user-fields"
    class="bg-white border-2 border-gray-800 rounded px-4 py-2 mr-2"
    on:click={cancel}>
    Cancel
  </button>
  <button
    {disabled}
    data-cy="submit-user-fields"
    on:click={submit}
    class="my-4 {disabled ? 'opacity-25 cursor-not-allowed ' : ''}px-4 py-2
    bg-gray-800 rounded text-white">
    Submit
  </button>
</div>
