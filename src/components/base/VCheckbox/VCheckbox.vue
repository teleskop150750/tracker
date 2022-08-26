<template>
    <div
        ref="rootRef"
        class="v-checkbox"
        :class="classes"
        role="checkbox"
        :aria-label="label"
        v-bind="attributes"
        @click="onClick"
        @keydown="onKeydown"
        @keyup="onKeyup"
        :tabindex="tabindex"
    >
        <div class="v-checkbox__inner" :class="innerClass">
            <input class="v-checkbox__native visually-hidden" :name="name" tabindex="-1" :value="modelValue" type="checkbox" />
            <div class="v-checkbox__bg">
                <svg class="v-checkbox__svg" viewBox="0 0 24 24">
                    <path class="v-checkbox__truthy" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                    <path class="v-checkbox__indet" d="M4,14H20V10H4"></path>
                </svg>
            </div>
        </div>
        <div v-if="label" class="v-checkbox__label">{{ label }}</div>
        <span ref="refocusRef" tabindex="-1" v-if="!disable"></span>
    </div>
</template>

<script setup>
import { computed, toRaw, ref } from 'vue'

const props = defineProps({
    name: {
        type: String,
        default: '',
    },
    modelValue: {
        required: true,
        default: null,
    },
    tabindex: {
        type: [String, Number],
        default: null,
    },
    val: {},
    ariaLabel: { type: String },
    trueValue: { default: true },
    falseValue: { default: false },
    indeterminateValue: { default: null },

    toggleOrder: {
        type: String,
        validator: (v) => v === 'tf' || v === 'ft',
    },
    toggleIndeterminate: {
        type: Boolean,
        default: false,
    },

    label: String,
    leftLabel: {
        type: Boolean,
        default: false,
    },

    disable: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const rootRef = ref(null)
const refocusRef = ref(null)
const tabindex = computed(() => (props.disable === true ? -1 : props.tabindex || 0))
const modelIsArray = computed(() => props.val !== void 0 && Array.isArray(props.modelValue))
const index = computed(() => {
    const val = toRaw(props.val)
    return modelIsArray.value === true ? props.modelValue.findIndex((opt) => toRaw(opt) === val) : -1
})
const isTrue = computed(() => (modelIsArray.value === true ? index.value > -1 : toRaw(props.modelValue) === toRaw(props.trueValue)))
const isFalse = computed(() => (modelIsArray.value === true ? index.value === -1 : toRaw(props.modelValue) === toRaw(props.falseValue)))
const isIndeterminate = computed(() => isTrue.value === false && isFalse.value === false)

const attributes = computed(() => {
    const attrs = {
        tabindex: tabindex.value,
        role: 'checkbox',
        'aria-label': props.label,
        'aria-checked': isIndeterminate.value === true ? 'mixed' : isTrue.value === true ? 'true' : 'false',
    }

    if (props.disable === true) {
        attrs['aria-disabled'] = 'true'
    }

    return attrs
})

function refocusTarget(e) {
    const root = rootRef.value

    if (e !== void 0 && e.type.indexOf('key') === 0) {
        if (root !== null && document.activeElement !== root && root.contains(document.activeElement) === true) {
            root.focus()
        }
    } else if (refocusRef.value !== null && (e === void 0 || (root !== null && root.contains(e.target) === true))) {
        refocusRef.value.focus()
    }
}

function onClick(event) {
    if (event !== void 0) {
        stopAndPrevent(event)
        refocusTarget(event)
    }

    if (props.disable !== true) {
        emit('update:modelValue', getNextValue(), event)
    }
}

function onKeydown(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        stopAndPrevent(event)
    }
}

function onKeyup(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        onClick(event)
    }
}

function getNextValue() {
    if (modelIsArray.value === true) {
        if (isTrue.value === true) {
            const val = props.modelValue.slice()
            val.splice(index.value, 1)
            return val
        }

        return props.modelValue.concat([props.val])
    }

    if (isTrue.value === true) {
        if (props.toggleOrder !== 'ft' || props.toggleIndeterminate === false) {
            return props.falseValue
        }
    } else if (isFalse.value === true) {
        if (props.toggleOrder === 'ft' || props.toggleIndeterminate === false) {
            return props.trueValue
        }
    } else {
        return props.toggleOrder !== 'ft' ? props.trueValue : props.falseValue
    }

    return props.indeterminateValue
}

function stopAndPrevent(e) {
    e.cancelable !== false && e.preventDefault()
    e.stopPropagation()
}

const classes = computed(() => ({
    'v-checkbox--disabled': props.disable === true,
}))

const innerClass = computed(() => {
    const state = isTrue.value === true ? 'truthy' : isFalse.value === true ? 'falsy' : 'indet'
    return [`v-checkbox__inner--${state}`]
})
</script>

<style>
.v-checkbox {
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: center;

    vertical-align: middle;

    outline: 0;

    cursor: pointer;
}

.v-checkbox--disabled {
    opacity: 0.75;
}

.v-checkbox__inner {
    position: relative;

    width: 1em;
    height: 1em;
    min-width: 1em;

    color: hsl(0deg 0% 0% / 54.1%);
    color: var(--v-color-primary);
    font-size: 32px;

    border-radius: 50%;

    outline: 0;

    user-select: none;
}

.v-checkbox:not(.v-checkbox--disabled) .v-checkbox__inner::before {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: '';

    border-radius: 50%;

    background: currentcolor;

    opacity: 0.12;
    transform: scale3d(0, 0, 1);

    transition: transform 0.22s cubic-bezier(0, 0, 0.2, 1);
}

.v-checkbox:not(.v-checkbox--disabled):focus .v-checkbox__inner::before,
.v-checkbox:not(.v-checkbox--disabled):hover .v-checkbox__inner::before {
    transform: scaleZ(1);
}

.v-checkbox__bg {
    position: absolute;
    top: 25%;
    left: 25%;

    width: 50%;
    height: 50%;

    border: 2px solid currentcolor;
    border-radius: 2px;

    user-select: none;

    transition: background 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;
}

.v-checkbox__inner--truthy .v-checkbox__bg,
.v-checkbox__inner--indet .v-checkbox__bg {
    background: currentcolor;
}

.v-checkbox__svg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    width: 100%;
    height: 100%;

    color: hsl(0deg 0% 100%);
}

.v-checkbox__truthy {
    stroke: currentcolor;
    stroke-width: 3.12px;
    stroke-dashoffset: 29.78334;
    stroke-dasharray: 29.78334;
}

.v-checkbox__indet {
    fill: currentcolor;
    transform: rotate(-280deg) scale(0);
    transform-origin: 50% 50%;
}

.v-checkbox__inner--indet .v-checkbox__indet {
    transform: rotate(0) scale(1);

    transition: transform 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;
}

.v-checkbox__inner--truthy path {
    stroke-dashoffset: 0;

    transition: stroke-dashoffset 0.18s cubic-bezier(0.4, 0, 0.6, 1) 0ms;
}

.v-checkbox__label {
    font-size: 14px;

    user-select: none;
}
</style>
