<script>
  export let small = false
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

<hr />
<div
  class="flex text-sm flex-row justify-center items-center text-gray-500 py-4"
  class:flex-col={small}>
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
  <a href="https://ko-fi.com/F1F313PRT" target="_blank">
    <img
      height="36"
      style="border:0px;height:36px;"
      src="https://az743702.vo.msecnd.net/cdn/kofi5.png?v=2"
      border="0"
      alt="Buy Me a Coffee at ko-fi.com" />
  </a>
</div>
