<template>
    <VSelect
        class="v-user-select"
        :multiple="multiple"
        :label="label"
        display="chip"
        v-model="value"
        :options="users"
        data-key="id"
        :max-selected-labels="3"
        :option-label="(user) => user.lastName + ' ' + user.firstName"
        @update:modelValue="onUpdate"
    >
        <template #option="{ option }">
            <div class="v-user-select__option">
                <div class="v-user-select__option-name">
                    {{ option.lastName + ' ' + option.firstName }}
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
    users: {
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
