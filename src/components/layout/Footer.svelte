<script>
  export let small = false
  import DcrckLogo from '/components/layout/dcrck'
</script>

<style>
  div:not(.flex-col) > * {
    @apply mb-0 mx-2;
  }
  div.flex-col > * {
    @apply mb-2 mx-0;
  }

  @media screen and (max-width: 768px) {
    div:not(.flex-col) {
      @apply flex-col;
    }
    div:not(.flex-col) > * {
      @apply mb-2 mx-0;
    }
  }
</style>

<hr class="mb-4" />
<div
  class="flex flex-wrap text-sm mb-12 flex-row justify-center items-center
  text-gray-500"
  class:flex-col={small}>
  <p class="text-center">Copyright 2019 BadukClub.</p>
  <p class="text-center" class:-mt-2={small}>All rights reserved.</p>
  <a href="docs/terms-of-service" class="underline hover:text-gray-800">
    Terms
  </a>
  <a href="docs/privacy-policy" class="underline hover:text-gray-800">
    Privacy Policy
  </a>
  <a href="/about" class="underline hover:text-gray-800">About Us</a>
  <a
    href="mailto:support@baduk.club"
    target="_blank"
    class="underline hover:text-gray-800">
    Need Help?
  </a>
  <a
    href="https://dcrck.cc"
    target="_blank"
    style="transition: .2s"
    class="flex items-center font-semibold px-2 py-1 border-2 rounded-sm
    text-gray-800 border-gray-800 opacity-50 hover:opacity-100 mt-2 xl:mt-0">
    Made with
    <span class="font-mono mx-1 text-xl">&#10084;</span>
    by
    <span class="ml-1">
      <DcrckLogo />
    </span>
  </a>
</div>
