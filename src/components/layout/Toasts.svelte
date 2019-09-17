<script>
  import Icon from '/components/Icon'
  let count = 0
  let toasts = []
  let themes = {
    danger: { icon: 'x-octagon', color: '#f56565' },
    success: { icon: 'smile', color: '#48bb78' },
    warning: { icon: 'alert-triangle', color: '#ecc94b' },
    info: { icon: 'info', color: '#4299e1' },
    default: { icon: 'bell', color: '#a0aec0' },
  }
  const animateOut = (node, { delay = 0, duration = 300 }) => ({
    delay,
    duration,
    css: t =>
      `opacity: ${(t - 0.5) *
        1}; transform-origin: top right; transform: scaleX(${(t - 0.5) * 1});`,
  })

  const createToast = (msg, theme, timeout) => {
    let newToast = { id: count++, msg, theme, timeout, width: '100%' }
    toasts = [newToast, ...toasts]
  }

  export const removeToast = id => (toasts = toasts.filter(t => t.id != id))

  export const show = (msg, theme = 'default', timeout = 3000) =>
    createToast(msg, theme, timeout)
</script>

<style>
  .toasts {
    @apply fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    top: 25px;
  }

  .toasts > .toast {
    @apply relative m-2 bg-white border-2;
    width: 300px;
    animation: animate-in 350ms forwards;
  }

  .toast.danger {
    @apply border-red-500;
  }
  .toast.danger > .progress {
    @apply bg-red-500;
  }

  .toast.success {
    @apply border-green-500;
  }
  .toast.success > .progress {
    @apply bg-green-500;
  }

  .toast.info {
    @apply border-blue-500;
  }
  .toast.info > .progress {
    @apply bg-blue-500;
  }

  .toast.warning {
    @apply border-yellow-500;
  }
  .toast.warning > .progress {
    @apply bg-yellow-500;
  }

  .toast.default {
    @apply border-gray-500;
  }
  .toast.default > .progress {
    @apply bg-gray-500;
  }

  .toasts > .toast .content {
    @apply block p-3 text-sm font-medium;
  }

  .toasts > .toast > .progress {
    @apply absolute bottom-0 w-full h-1;
    animation-name: shrink;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  .toasts > .toast:before,
  .toasts > .toast:after {
    @apply absolute bottom-0;
    content: '';
    z-index: -1;
    top: 50%;
    left: 10px;
    right: 10px;
    border-radius: 100px / 10px;
  }

  .toasts > .toast:after {
    right: 10px;
    left: auto;
    transform: skew(8deg) rotate(3deg);
  }

  @keyframes animate-in {
    0% {
      opacity: 0;
      transform: scale(1.15) translateY(20px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes shrink {
    0% {
      width: 300px;
    }
    100% {
      width: 0;
    }
  }
</style>

<ul class="toasts">
  {#each toasts as { theme, msg, timeout, id } (id)}
    <li class="toast {theme}" out:animateOut>
      <div class="flex items-center">
        <span class="mx-2">
          <Icon id={themes[theme].icon} color={themes[theme].color} />
        </span>
        <div class="content">{msg}</div>
      </div>
      <div
        class="progress"
        style="animation-duration: {timeout}ms;"
        on:animationend={() => removeToast(id)} />
    </li>
  {/each}
</ul>
