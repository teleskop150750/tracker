import { unref } from 'vue'
import useEventListener from './useEventListener'

export default function useClickAway(target, content, handler) {
    const event = 'pointerdown'

    if (typeof window === 'undefined' || !window) {
        return
    }

    const listener = (event) => {
        const el = unref(target)
        const cnt = unref(content)
        if (!el || !cnt) {
            return
        }

        if (cnt === event.target || event.composedPath().includes(cnt)) {
            return
        }

        if (el === event.target || event.composedPath().includes(el)) {
            return
        }

        handler(event)
    }

    return useEventListener(window, event, listener)
}
