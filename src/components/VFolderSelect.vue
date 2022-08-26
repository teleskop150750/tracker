<template>
    <VSelect
        class="v-folder-select"
        :multiple="multiple"
        :label="label"
        :model-value="modelValue"
        :options="folders"
        :max-selected-labels="3"
        display="chip"
        data-key="id"
        option-label="name"
        @update:modelValue="onUpdate"
    >
        <template #option="{ option }">
            <div class="v-folder-select__option">
                <div class="v-folder-select__option-name">
                    {{ option.name }}
                </div>
                <div class="v-folder-select__option-path">
                    {{ option.path }}
                </div>
            </div>
        </template>
    </VSelect>
</template>

<script setup>
import { ref } from 'vue'
import VSelect from './base/VSelect/VSelect.vue'

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: '',
    },
    folders: {
        type: Array,
        default: () => [],
    },
    modelValue: null,
})

const emit = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)

function onUpdate(payload) {
    value.value = payload
    emit('update:modelValue', payload)
}
</script>

<style>
.v-folder-select__option {
    padding: 4px 0;
    display: grid;
    gap: 2px;
}

.v-folder-select__option-path {
    opacity: 0.6;
}
</style>
