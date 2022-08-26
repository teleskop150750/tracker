<template>
    <div class="v-text-field" :class="[$attrs.class, containerClasses]">
        <label v-if="label" class="v-text-field__label" :for="id">
            {{ label }}
        </label>

        <input
            class="v-text-field__input"
            ref="inputRef"
            :id="id"
            :type="type"
            :name="name"
            :value="modelValue"
            v-bind="inputAttrs"
            @input="onInput($event.target.value)"
        />
    </div>
</template>

<script>
import { getCurrentInstance, computed, ref, useAttrs } from 'vue'

export default {
    inheritAttrs: false,
}
</script>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: 'text',
    },
    type: {
        type: String,
        default: 'text',
    },
    dark: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const inputRef = ref()
const id = getCurrentInstance().uid

const containerClasses = computed(() => ({
    'v-text-field--dark': props.dark,
}))

const inputAttrs = computed(() => {
    const newAttrs = { ...attrs }
    delete newAttrs.class

    return newAttrs
})

function onInput(value) {
    emit('update:modelValue', value)
}

function focus() {
    inputRef.value.focus()
}

defineExpose({
    inputRef,
    focus,
})
</script>

<style>
.v-text-field {
    display: grid;
    grid-auto-rows: min-content;
    grid-template-columns: 100%;
}

.v-text-field__label {
    margin-bottom: 0.5rem;

    color: hsl(227deg 11% 16%);
    font-size: 0.875rem;
}

.v-text-field__input {
    display: block;

    padding: 0.5rem 0.75rem;

    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.5;

    border: 1px solid hsl(214deg 22% 77%);
    border-radius: 0.25rem;

    background-color: hsl(0deg 0% 100%);

    appearance: none;
    min-height: 2.5rem;
}

.v-text-field--dark .v-text-field__input {
    color: hsl(0deg 0% 100%);

    background-color: hsl(0deg 0% 100% / 8%);
}

.v-text-field__input::placeholder {
    color: hsl(214deg 20% 69%);
}

.v-text-field--dark .v-text-field__input::placeholder {
    color: hsl(214deg 20% 69%);
}

.v-text-field__input:focus {
    border-color: rgb(172 148 250);

    outline: 0;

    box-shadow: 0 0 0 3px rgb(162 142 255 / 65%);
}
</style>
