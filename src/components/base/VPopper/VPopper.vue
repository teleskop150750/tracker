<template>
    <div class="v-popper" :style="interactiveStyle" @mouseleave="hover && closePopper()" ref="popperContainerRef">
        <div
            ref="popperTriggerRef"
            class="v-popper__trigger"
            @click="togglePopper"
            @focus="openPopper"
            @mouseover="hover && openPopper()"
            @keyup.esc="closePopper"
        >
            <slot />
        </div>
        <VPortal :appendTo="appendTo" :disabled="teleportDisabled">
            <Transition
                :name="transitionName"
                @before-enter="$emit('before-enter')"
                @enter="$emit('enter')"
                @after-enter="$emit('after-enter')"
                @enter-cancelled="$emit('enter-cancelled')"
                @before-leave="$emit('before-leave')"
                @leave="$emit('leave')"
                @after-leave="$emit('after-leave')"
                @leave-cancelled="$emit('leave-cancelled')"
            >
                <div
                    v-show="shouldShowPopper"
                    class="v-popper-content"
                    :style="popperContentStyles"
                    ref="popperContentRef"
                    @click="!interactive && closePopper()"
                >
                    <slot name="content" :close="close" :isOpen="modifiedIsOpen">
                        {{ content }}
                    </slot>
                </div>
            </Transition>
        </VPortal>
    </div>
</template>

<script setup>
import VPortal from '../VPortal/VPortal.vue'
import { debounce } from '../../utils/debounce/debounce'
import { ref, computed, useSlots, toRefs, watch, watchEffect, onMounted, defineEmits } from 'vue'
import { usePopper, useContent, useClickAway } from './composables'

const emit = defineEmits([
    'open:popper',
    'close:popper',
    'before-enter',
    'enter',
    'after-enter',
    'enter-cancelled',
    'before-leave',
    'leave',
    'after-leave',
    'leave-cancelled',
])
const slots = useSlots()
const props = defineProps({
    transitionName: {
        type: String,
        default: 'v-popper-content',
    },
    appendTo: {
        type: String,
        default: 'body',
    },
    teleportDisabled: {
        type: Boolean,
        default: false,
    },
    /**
     * Preferred placement (the "auto" placements will choose the side with most space.)
     */
    placement: {
        type: String,
        default: 'bottom',
        validator: function (value) {
            return [
                'auto',
                'auto-start',
                'auto-end',
                'top',
                'top-start',
                'top-end',
                'bottom',
                'bottom-start',
                'bottom-end',
                'right',
                'right-start',
                'right-end',
                'left',
                'left-start',
                'left-end',
            ].includes(value)
        },
    },
    /**
     * Disables automatically closing the popover when the user clicks away from it
     */
    disableClickAway: {
        type: Boolean,
        default: false,
    },
    /**
     * Offset in pixels along the trigger element
     */
    offsetSkid: {
        type: String,
        default: '0',
    },
    /**
     * Offset in pixels away from the trigger element
     */
    offsetDistance: {
        type: String,
        default: '0',
    },
    /**
     * Trigger the popper on hover
     */
    hover: {
        type: Boolean,
        default: false,
    },
    /**
     * Manually open/close the Popper, other events are ignored if this prop is set
     */
    show: {
        type: Boolean,
        default: null,
    },
    /**
     * Disables the Popper. If it was already open, it will be closed.
     */
    disabled: {
        type: Boolean,
        default: false,
    },
    /**
     * Open the Popper after a delay (ms).
     */
    openDelay: {
        type: [Number, String],
        default: 0,
    },
    /**
     * Close the Popper after a delay (ms).
     */
    closeDelay: {
        type: [Number, String],
        default: 0,
    },
    /**
     * The z-index of the Popper.
     */
    zIndex: {
        type: [Number, String],
        default: 9999,
    },
    /**
     * Display an arrow on the popper
     */
    arrow: {
        type: Boolean,
        default: false,
    },
    /**
     * Stop arrow from reaching the edge of the popper
     */
    arrowPadding: {
        type: String,
        default: '0',
    },
    /**
     * If the Popper should be interactive, it will close when clicked/hovered if false
     */
    interactive: {
        type: Boolean,
        default: true,
    },
    /**
     * Lock the Popper into place, it will not flip dynamically when it runs out of space if true
     */
    locked: {
        type: Boolean,
        default: false,
    },
    /**
     * If the content is just a simple string, it can be passed in as a prop
     */
    content: {
        type: String,
        default: null,
    },
})

const popperContainerRef = ref(null)
const popperContentRef = ref(null)
const popperTriggerRef = ref(null)
const modifiedIsOpen = ref(false)

onMounted(() => {
    const children = slots.default()

    if (children && children.length > 1) {
        return console.error(
            `[Popper]: The <Popper> component expects only one child element at its root. You passed ${children.length} child nodes.`
        )
    }
})

const {
    arrowPadding,
    closeDelay,
    content,
    disableClickAway,
    disabled,
    interactive,
    locked,
    offsetDistance,
    offsetSkid,
    openDelay,
    placement,
    show,
} = toRefs(props)

const { isOpen, open, close } = usePopper({
    arrowPadding,
    emit,
    locked,
    offsetDistance,
    offsetSkid,
    placement,
    popperNode: popperContentRef,
    triggerNode: popperTriggerRef,
})

const { hasContent } = useContent(slots, popperContentRef, content)

const manualMode = computed(() => show.value !== null)
const invalid = computed(() => disabled.value || !hasContent.value)
const shouldShowPopper = computed(() => isOpen.value && !invalid.value)
const enableClickAway = computed(() => !disableClickAway.value && !manualMode.value)
// Add an invisible border to keep the Popper open when hovering from the trigger into it
const interactiveStyle = computed(() => {
    const styles = {}

    if (interactive.value) {
        styles.border = `${offsetDistance.value}px solid transparent`
        styles.margin = `-${offsetDistance.value}px`
    }

    return styles
})

const popperContentStyles = computed(() => {
    const styles = {
        '--v-popper-content-z-index': props.zIndex,
    }

    return styles
})

const openPopperDebounce = debounce(open, openDelay.value)
const closePopperDebounce = debounce(close, closeDelay.value)

const openPopper = async () => {
    if (invalid.value || manualMode.value) {
        return
    }

    closePopperDebounce.clear()
    openPopperDebounce()
}

const closePopper = async () => {
    if (manualMode.value) {
        return
    }

    openPopperDebounce.clear()
    closePopperDebounce()
}

const togglePopper = () => {
    isOpen.value ? closePopper() : openPopper()
}

/**
 * If Popper is open, we automatically close it if it becomes
 * disabled or without content.
 */
watch([hasContent, disabled], ([hasContent, disabled]) => {
    if (isOpen.value && (!hasContent || disabled)) {
        close()
    }
})

/**
 * In order to eliminate flickering or visibly empty Poppers due to
 * the transition when using the isOpen slot property, we need to return a
 * separate debounced value based on isOpen.
 */
watch(isOpen, (isOpen) => {
    if (isOpen) {
        modifiedIsOpen.value = true
    } else {
        debounce(() => {
            modifiedIsOpen.value = false
        }, 200)
    }
})

/**
 * Watch for manual mode.
 */
watchEffect(() => {
    if (manualMode.value) {
        show.value ? openPopperDebounce() : closePopperDebounce()
    }
})

/**
 * Use click away if it should be enabled.
 */
watchEffect(() => {
    if (enableClickAway.value) {
        useClickAway(popperContainerRef, popperContentRef, closePopper)
    }
})
</script>

<style scoped>
.v-popper {
    display: inline-block;
}

.v-popper-content {
    /* z-index: var(--v-popper-content-z-index); */
    z-index: v-bind(zindex);

    border-color: rgb(214 214 214);
    border-style: solid;
    border-width: 1px;
    border-radius: 2px;

    background: var(--v-container-background-color-light);

    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 16%), 0 0 1px 0 rgb(0 0 0 / 16%);

    transition: background 250ms ease-in-out;
}

.v-popper-content:hover,
.v-popper-content:hover > #arrow::before {
    background: var(--v-container-background-color-light);
}

.inline-block {
    display: inline-block;
}

.v-popper-content-enter-active,
.v-popper-content-leave-active {
    transition: opacity 0.1s ease;
}

.v-popper-content-enter-from,
.v-popper-content-leave-to {
    opacity: 0;
}
</style>
