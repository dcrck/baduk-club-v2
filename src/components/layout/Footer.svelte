<script>
  export let small = false
</script>

<style>
  div > * {
    @apply mb-0 mx-2;
  }
  div.flex-col > * {
    @apply mb-2 mx-0;
  }
</style>

<hr />
<div
  class="flex text-sm flex-col justify-center items-center text-gray-500 py-4"
  class:md:flex-row={!small}>
  <p class="text-center">Copyright 2019 BadukClub.</p>
  <p class="text-center" class:-mt-2={small}>All rights reserved.</p>
  <a href="docs/terms-of-service" class="underline hover:text-gray-800">
    Terms
  </a>
  <a href="docs/privacy-policy" class="underline hover:text-gray-800">
    Privacy Policy
  </a>
  <a href="mailto:support@baduk.club" class="underline hover:text-gray-800">
    Support
  </a>
</div>
