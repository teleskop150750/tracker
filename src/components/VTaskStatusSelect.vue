<template>
    <VSelect
        class="v-task-status-select"
        :label="label"
        display="chip"
        v-model="value"
        :options="statuses"
        data-key="id"
        :max-selected-labels="3"
        option-label="name"
        @update:modelValue="onUpdate"
    >
        <template #option="{ option }">
            <div class="v-task-status-select__option">
                <div class="v-task-status-select__option-name">
                    {{ option.name }}
                </div>
            </div>
        </template>
    </VSelect>
</template>

<script setup>
import { ref } from 'vue'
import VSelect from './base/VSelect/VSelect.vue'

const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    statuses: {
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
