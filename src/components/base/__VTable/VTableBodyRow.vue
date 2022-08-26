<template>
    <tr class="v-table-body-row" @click="onClick" @keydown="onKeyDown" @touchend="onTouchEnd" tabindex="0">
        <slot />
    </tr>

    <template v-if="isExpanded && row.children && row.children.length">
        <VTableBodyRow
            v-for="childRow in row.children"
            :key="rowKeyFn(childRow)"
            :rowKey="rowKeyFn(childRow)"
            :rowKeyFn="rowKeyFn"
            :columns="columns"
            :row="childRow"
            :parentRow="row"
            :level="level + 1"
            :indentation="indentation"
            :expandedKeys="expandedKeys"
            :selectionRows="selectionRows"
            @row-toggle="$emit('row-toggle', $event)"
            @checkbox-change="onCheckboxChange"
        >
            <template v-for="column in columns" :key="rowKeyFn(childRow) + column.field">
                <VTableBodyCell
                    :row="childRow"
                    :rowKey="rowKeyFn(childRow)"
                    :rowKeyFn="rowKeyFn"
                    :level="level + 1"
                    :indentation="indentation"
                    :is-leaf="getIsRowLeaf(childRow).value"
                    :is-expanded="getIsExpanded(expandedKeys, rowKeyFn(childRow)).value"
                    :column="column"
                    :selectionRows="selectionRows"
                    @row-toggle="$emit('row-toggle', $event)"
                    @checkbox-change="onCheckboxChange"
                >
                    <template #[`item-${column.field}`]>
                        <slot :name="`item-${column.field}`">
                            {{ row[column.field] }}
                        </slot>
                    </template>
                </VTableBodyCell>
            </template>
        </VTableBodyRow>
    </template>
</template>

<script setup>
import VTableBodyCell from './VTableBodyCell.vue'
import { useTable } from './useTable'
import { computed } from 'vue'
// import { DomHandler } from '../../utils'

const props = defineProps({
    row: {
        type: null,
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
    parentRow: {
        type: null,
        default: null,
    },
    columns: {
        type: null,
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
    expandedKeys: {
        type: Object,
        default: () => ({}),
    },
    selectionRows: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['row-toggle', 'checkbox-change'])

const { getIsRowLeaf, getIsExpanded } = useTable()

// const isExpanded = getIsExpanded(toRef(props, 'expandedKeys'), toRef(props, 'rowKey'))
const isExpanded = computed(() => props.expandedKeys[props.rowKey] === true)

function onCheckboxChange(payload) {
    emit('checkbox-change', payload)
}
</script>

<style>
.v-table-body-row {
    white-space: nowrap;

    border-bottom: 1px solid rgb(147 147 147);
    border-collapse: collapse;
}
</style>
