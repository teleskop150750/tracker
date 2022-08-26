import { defineComponent, onMounted, watch, ref, cloneVNode, onUnmounted, Comment, computed } from 'vue'
import { createFocusTrap } from 'focus-trap'

function defineFocusTrapProps(props) {
    return props
}

const FocusTrapProps = defineFocusTrapProps({
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
})

export const FocusTrap = defineComponent({
    props: Object.assign(
        {
            active: {
                // TODO: could be options for activate but what about the options for deactivating?
                type: Boolean,
                default: true,
            },
        },
        FocusTrapProps
    ),

    emits: ['update:active', 'activate', 'postActivate', 'deactivate', 'postDeactivate'],

    render() {
        return this.renderImpl()
    },

    setup(props, { slots, emit }) {
        let trap
        const wrapperEl = ref(null)
        const el = computed(() => {
            const innerElement = wrapperEl.value
            return innerElement && (innerElement instanceof HTMLElement ? innerElement : innerElement.$el)
        })

        const ensureTrap = () => {
            if (trap) {
                return trap
            }

            return (trap = createFocusTrap(el.value, {
                escapeDeactivates: props.escapeDeactivates,
                allowOutsideClick: props.allowOutsideClick,
                returnFocusOnDeactivate: props.returnFocusOnDeactivate,
                clickOutsideDeactivates: props.clickOutsideDeactivates,
                onActivate: () => {
                    emit('update:active', true)
                    emit('activate')
                },
                onDeactivate: () => {
                    emit('update:active', false)
                    emit('deactivate')
                },
                onPostActivate: () => emit('postActivate'),
                onPostDeactivate: () => emit('postDeactivate'),
                initialFocus: props.initialFocus,
                fallbackFocus: props.fallbackFocus,
            }))
        }

        onMounted(() => {
            watch(
                () => props.active,
                (active) => {
                    if (active && el.value) {
                        // has no effect if already activated
                        ensureTrap().activate()
                    } else if (trap) {
                        trap.deactivate()
                        // this allows v-if blocks to work by invalidating the trap
                        // and forcing a new one to be created
                        if (!el.value || el.value.nodeType === Node.COMMENT_NODE) {
                            trap = null
                        }
                    }
                },
                { immediate: true, flush: 'post' }
            )
        })

        onUnmounted(() => {
            if (trap) trap.deactivate()
            trap = null
        })

        // Use object-return for setup so that we can expose the 'activate'
        // and 'deactivate' methods without making use of the 'expose({ ... })'
        // method as the ExposeProxy system is problematic for users migrating
        // from Vue2 -> Vue3 due to the ExposeProxy (correctly) preventing child
        // components from reading the internal state of their $parent. This is
        // problematic for migrating users because the the Vue2-based VueRouter
        // _requires_ that functionality as it does $parent._routerRoot to set
        // the $router and $route properties on components.
        return {
            activate() {
                ensureTrap()
                trap.activate()
            },
            deactivate() {
                trap && trap.deactivate()
            },
            renderImpl() {
                if (!slots.default) return null

                const vNodes = slots.default()
                if (!vNodes || !vNodes.length || vNodes.length > 1) {
                    if (__DEV__) {
                        console.error('[focus-trap-vue]: FocusTrap requires exactly one child.')
                    }

                    return vNodes
                }
                const vnode = cloneVNode(vNodes[0], { ref: wrapperEl })
                return vnode
            },
        }
    },
})
