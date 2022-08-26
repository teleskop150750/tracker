import { h, onScopeDispose, ref, watch, unref } from 'vue'
import { createFocusTrap } from 'focus-trap'

export default {
    props: {
        as: ['String', Object],
        escapeDeactivates: {
            type: Boolean,
            default: true,
        },
        returnFocusOnDeactivate: {
            type: Boolean,
            default: true,
        },
        allowOutsideClick: {
            type: [Boolean, Function],
            default: true,
        },

        clickOutsideDeactivates: [Boolean, Function],

        initialFocus: [String, Function, Boolean],

        fallbackFocus: [String, Function],

        checkCanFocusTrap: Function,

        checkCanReturnFocus: Function,

        delayInitialFocus: { type: Boolean, default: true },

        document: Object,

        preventScroll: Boolean,

        setReturnFocus: [Object, String, Boolean, Function],
    },
    emits: ['activate', 'postActivate', 'deactivate', 'postDeactivate'],

    setup(props, { slots, emit }) {
        let trap
        const target = ref()

        function resolveUnref(r) {
            return typeof r === 'function' ? r() : unref(r)
        }

        function unrefElement(elRef) {
            const plain = resolveUnref(elRef)

            return plain?.$el ?? plain
        }

        const activate = () => trap && trap.activate()
        const deactivate = () => trap && trap.deactivate()

        watch(
            () => unrefElement(target),
            (el) => {
                if (!el) {
                    return
                }

                trap = createFocusTrap(el, {
                    escapeDeactivates: props.escapeDeactivates,
                    allowOutsideClick: props.allowOutsideClick,
                    returnFocusOnDeactivate: props.returnFocusOnDeactivate,
                    clickOutsideDeactivates: props.clickOutsideDeactivates,
                    onActivate: () => {
                        emit('activate')
                    },
                    onDeactivate: () => {
                        emit('deactivate')
                    },
                    onPostActivate: () => emit('postActivate'),
                    onPostDeactivate: () => emit('postDeactivate'),
                })
                activate()
            },
            { flush: 'post' }
        )

        // Cleanup on unmount
        onScopeDispose(() => deactivate())

        return () => {
            if (slots.default) {
                return h(props.as || 'div', { ref: target }, slots.default())
            }
        }
    },
}
