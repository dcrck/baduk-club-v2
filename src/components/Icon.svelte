<script>
  export let size = 24
  export let color = '#262621'
  export let id
  export let fill = 'none'
</script>

<style>
  .feather {
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>

<svg class="feather {id}" width={size} height={size} stroke={color} {fill}>
  <use xlink:href="feather-sprite.svg#{id}" />
</svg>
