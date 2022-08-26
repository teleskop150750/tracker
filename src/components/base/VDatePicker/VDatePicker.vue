<template>
    <div ref="containerRef" class="v-date-picker">
        <div ref="triggerRef" class="v-date-picker__input">
            <VTextField @click="openDate" :label="label" readonly autocomplete="off" v-model="inputValue" />
        </div>
        <VPortal appendTo="body">
            <VDatePickerPanel
                v-if="isOpen"
                :parent="containerRef"
                v-model:isOpen="isOpen"
                :model-value="inputValue"
                @update:model-value="onSelect"
            />
        </VPortal>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import VTextField from '../VTextField/VTextField.vue'
import VPortal from '../VPortal/VPortal.vue'
import VDatePickerPanel from './VDatePickerPanel.vue'

const props = defineProps({
    label: null,
    modelValue: null,
})

const emit = defineEmits(['update:modelValue'])
const containerRef = ref(null)
const triggerRef = ref(null)

const inputValue = ref(props.modelValue)
const isOpen = ref(false)

function onSelect(val) {
    inputValue.value = val
}

function openDate() {
    isOpen.value = true
}
</script>

<style>
.v-date-picker {
    position: relative;
}
</style>
