<template>
    <label class="v-radio" :class="classes">
        <span class="v-radio__input">
            <input
                class="v-radio__original visually-hidden"
                :value="modelValue"
                :name="name"
                type="radio"
                @focus="focus = true"
                @blur="focus = false"
                @change="onChange"
            />
            <span class="v-radio__inner"></span>
        </span>
        <span class="v-radio__label">
            <slot />
        </span>
    </label>
</template>

<script>
import { ObjectUtils } from '../../utils/ObjectUtils/ObjectUtils'
export default {
    props: {
        modelValue: {
            type: [String, Number, Boolean],
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        value: {
            type: [String, Object, Number],
            default: '',
        },
    },
    emits: {
        'update:modelValue': null,
    },
    data() {
        return {
            focus: false,
        }
    },
    methods: {
        onChange() {
            this.$nextTick(() => this.$emit('update:modelValue', this.value))
        },
    },
    computed: {
        classes() {
            return {
                'v-radio--checked': this.checked,
                'v-radio--focus': this.focus,
            }
        },
        checked() {
            return this.modelValue != null && ObjectUtils.equals(this.modelValue, this.value)
        },
    },
}
</script>

<style>
.v-radio {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    cursor: pointer;
}

.v-radio__input {
    position: relative;

    display: inline-flex;

    white-space: nowrap;
    vertical-align: middle;

    outline: none;

    cursor: pointer;
}

.v-radio__inner {
    position: relative;

    display: inline-block;

    width: 1rem;
    height: 1rem;
    box-sizing: border-box;

    border: 2px solid var(--v-color-primary);
    border-radius: 4rem;

    background-color: transparent;
    background-color: var(--v-container-background-color-light);

    cursor: pointer;
}

.v-radio--checked .v-radio__inner {
    border: 4px solid var(--v-color-primary);
}

.v-radio--focus .v-radio__inner {
    box-shadow: 0 0 0 3px rgb(162 142 255 / 65%);
}

.v-radio__label {
    font-size: 14px;
}
</style>
