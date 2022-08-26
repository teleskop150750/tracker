<template>
    <td class="v-table-body-cell">
        <div class="v-table-body-cell__wrapper" :style="cellStyles">
            <div class="v-table-body-cell__inner">
                <button
                    v-if="isExpander && !isLeaf"
                    class="v-table-body-cell__toggler"
                    type="button"
                    aria-label="toggler"
                    @click="toggleRow"
                >
                    <component :is="togglerIcon"></component>
                </button>
                <VCheckbox v-if="isExpander && row.canSelect" :model-value="checkboxValue" @update:model-value="toggleCheckbox" />

                <div class="v-table-body-cell__content">
                    <slot :name="`item-${column.field}`">
                        {{ `item-${column.field}` }}
                    </slot>
                </div>
            </div>
        </div>
    </td>
</template>

<script setup>
import { computed } from 'vue'
import VCheckbox from '../VCheckbox/VCheckbox.vue'
import VArrowDownIcon from '../../icons/VArrowDownIcon'
import VArrowRightIcon from '../../icons/VArrowRightIcon'

const props = defineProps({
    row: {
        type: Object,
        required: true,
    },
    rowKey: {
        type: null,
        required: true,
    },
    rowKeyFn: {
        type: [Function],
        default: (row) => row['id'],
    },
    isExpanded: {
        type: Boolean,
        default: false,
    },
    column: {
        type: Object,
        required: true,
    },
    level: {
        type: Number,
        default: 0,
    },
    indentation: {
        type: Number,
        default: 14,
    },
    isLeaf: {
        type: Boolean,
        default: false,
    },
    isChecked: {
        type: Boolean,
        default: false,
    },
    isPartialChecked: {
        type: Boolean,
        default: false,
    },
    selection: {
        type: Boolean,
        default: false,
    },
    selectionRows: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['row-toggle', 'checkbox-change'])

const checkboxValue = computed(() => {
    const row = props.selectionRows.find((item) => {
        return props.rowKeyFn(item) === props.rowKey
    })

    return !!row
})

const isExpander = computed(() => props.column.expander === true)

const togglerIcon = computed(() => (props.isExpanded ? VArrowDownIcon : VArrowRightIcon))

function toggleRow() {
    emit('row-toggle', props.row)
}

function toggleCheckbox(value) {
    emit('checkbox-change', {
        row: props.row,
        check: value,
    })
}

const cellStyles = computed(() => {
    const styles = {}

    if (isExpander.value) {
        styles.paddingLeft = props.level * props.indentation + 'px'
    }

    return styles
})
</script>

<style>
.v-table-body-cell {
    padding: 0;

    border: 1px solid hsl(210deg 14% 89%);
    border-bottom: 2px solid hsl(210deg 14% 89%);
}

.v-table-body-cell__inner {
    display: flex;
    gap: 0.25rem;
    align-items: center;

    padding: 0.5rem;
}

.v-table-body-cell__toggler {
    position: relative;

    display: inline-flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;

    padding: 0.5rem;

    color: inherit;
    font: inherit;

    border: 0;

    background-color: transparent;

    cursor: pointer;

    overflow: hidden;
}
</style>
