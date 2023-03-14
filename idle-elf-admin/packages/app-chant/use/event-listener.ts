import {
  Ref,
  unref,
  onUnmounted,
  onDeactivated,
  onMounted,
  onActivated
} from 'vue'

let supportsPassive = false

try {
  const opts = {}
  Object.defineProperty(opts, 'passive', {
    get() {
      supportsPassive = true
    }
  })
  window.addEventListener('test-passive', null as any, opts)
  // eslint-disable-next-line
} catch (e) {}

interface UseEventListenerOptions {
  target?: EventTarget | Ref<EventTarget | undefined>
  capture?: boolean
  passive?: boolean
}

function useEventListener(
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions = {}
) {
  const { target = window, passive = false, capture = false } = options

  let attached: boolean

  const add = () => {
    const element = unref(target)

    if (element && !attached) {
      element.addEventListener(
        type,
        listener,
        supportsPassive ? { capture, passive } : capture
      )
      attached = true
    }
  }

  const remove = () => {
    const element = unref(target)
    if (element && attached) {
      element.removeEventListener(type, listener, capture)
      attached = false
    }
  }

  onUnmounted(remove)
  onDeactivated(remove)
  onMounted(add)
  onActivated(add)
}

export default useEventListener
