<template>
    <div ref="panelRef" class="v-date-picker-panel">
        <div class="v-date-picker-panel--overlay"></div>
        <VDate class="v-date-picker-panel__date" v-model="dateValue">
            <div class="v-date-picker-panel__actions">
                <VBtn label="Выбрать" @click="onSelect" />
                <VBtn label="Отмена" @click="onClose" />
            </div>
        </VDate>
    </div>
</template>

<script setup>
import { DomHandler } from '../../utils'
import { ref, computed, onMounted } from 'vue'
import VDate from '../VDate/VDate.vue'
import VBtn from '../VBtn/VBtn.vue'
import { useClickAway } from './composables'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    parent: null,
    modelValue: null,
})

const emit = defineEmits(['update:modelValue', 'update:isOpen'])
const dateValue = ref(props.modelValue)
const panelRef = ref(null)
const parentRef = computed(() => props.parent)

function onClose() {
    emit('update:isOpen', false)
}

function onSelect() {
    emit('update:modelValue', dateValue.value)
    onClose()
}

function alignOverlay() {
    DomHandler.absolutePosition(panelRef.value, parentRef.value)
}

onMounted(() => {
    // dateValue.value = props.modelValue
    alignOverlay()
})

// useClickAway(parentRef, panelRef, onClose)
</script>

<style>
.v-date-picker-panel {
    position: absolute;
    box-shadow: 0 0 0.8rem 0.2rem rgba(48, 48, 48, 0.25);
}

.v-date-picker-panel__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.v-date-picker-panel--overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
}

.v-date-picker-panel__date {
    position: relative;
}
</style>
