<template>
    <div class="v-table">
        <div class="v-table__body">
            <table class="v-table__table">
                <thead>
                    <VTableHeadRow>
                        <VTh v-for="column in columns" :key="column.value">
                            {{ column.text }}
                        </VTh>
                    </VTableHeadRow>
                </thead>
                <tbody class="v-table__table-body">
                    <VTableBodyRow
                        v-for="row in rows"
                        :key="rowKeyFn(row)"
                        :rowKey="rowKeyFn(row)"
                        :rowKeyFn="rowKeyFn"
                        :columns="columns"
                        :row="row"
                        :level="0"
                        :indentation="indentation"
                        :expandedKeys="expandedKeys"
                        :selectionRows="selectionRows"
                        @row-toggle="onRowToggle"
                        @checkbox-change="onCheckboxChange"
                    >
                        <template v-for="column in columns" :key="rowKeyFn(row) + column.field">
                            <VTableBodyCell
                                :row="row"
                                :rowKey="rowKeyFn(row)"
                                :rowKeyFn="rowKeyFn"
                                :is-expanded="getIsExpanded(expandedKeys, rowKeyFn(row)).value"
                                :level="0"
                                :indentation="indentation"
                                :is-leaf="getIsRowLeaf(row).value"
                                :column="column"
                                :selectionRows="selectionRows"
                                @row-toggle="onRowToggle"
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
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import VTableHeadRow from './VTableHeadRow.vue'
import VTableBodyRow from './VTableBodyRow.vue'
import VTableBodyCell from './VTableBodyCell.vue'
import VTh from './VTh'
import { useTable } from './useTable'
import { computed, useSlots } from 'vue'
// import VTd from './VTd'
// import VSettingsIcon from '../../icons/VSettingsIcon'
// import GridColumnSelector from './GridColumnSelector'

const props = defineProps({
    indentation: {
        type: Number,
        default: 14,
    },
    columns: {
        type: Array,
        default: () => [],
    },
    rows: {
        type: Array,
        default: () => [],
    },
    rowKey: {
        type: [String, Function],
        default: 'id',
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

const emit = defineEmits(['update:expanded-keys', 'row-collapse', 'row-expand', 'update:selectionRows', 'row-select', 'row-unselect'])
const slots = useSlots()

const { getIsRowLeaf, getIsExpanded } = useTable()
const rowKeyFn = computed(() => (typeof props.rowKey === 'function' ? props.rowKey : (row) => row[props.rowKey]))

function onRowToggle(row) {
    const expandedKeys = { ...props.expandedKeys }

    const key = rowKeyFn.value(row)

    if (expandedKeys[key]) {
        delete expandedKeys[key]
        emit('row-collapse', row)
    } else {
        expandedKeys[key] = true
        emit('row-expand', row)
    }

    emit('update:expanded-keys', expandedKeys)
}

function onCheckboxChange(payload) {
    let selectionRows = [...props.selectionRows]
    const row = payload.row

    if (payload.check) {
        selectionRows.push(row)
        emit('row-select', row)
    } else {
        emit('row-unselect', row)
        selectionRows = selectionRows.filter((item) => rowKeyFn.value(item) !== rowKeyFn.value(row))
    }

    emit('update:selectionRows', selectionRows)
}
</script>

<style>
.v-table {
    position: relative;

    overflow: hidden;
}

.v-table--sticky-header-column td:first-child {
    background-color: hsl(134deg 70% 86%) !important;
}

.v-table--sticky-header-column tr th {
    position: sticky;
    z-index: 2;

    background: hsl(0deg 0% 100%);
}

.v-table--sticky-header-column thead tr:last-child th {
    top: 48px;
    z-index: 3;
}

.v-table--sticky-header-column thead tr:first-child th {
    top: 0;
    z-index: 1;
}

.v-table--sticky-header-column tr:first-child th:first-child {
    z-index: 3;
}

.v-table--sticky-header-column td:first-child {
    z-index: 1;
}

.v-table--sticky-header-column td:first-child,
.v-table--sticky-header-column th:first-child {
    position: sticky;
    left: 0;
}

.v-table__body {
    width: 100%;
    height: 100%;

    overflow: auto;

    will-change: scroll-position;
}

.v-table__table {
    width: 100%;
    max-width: 100%;

    font-size: 14px;
    white-space: nowrap;

    border-collapse: collapse;

    background-color: transparent;

    /* border-left: 1px solid rgb(147, 147, 147); */
}

.v-table__table-body {
    background-color: rgb(255 255 255);
}

.v-table__footer {
    padding: 0.75rem 1rem;

    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.025em;
    text-transform: uppercase;

    border-top: 1px solid hsl(220deg 13% 91%);

    background-color: hsl(210deg 20% 98%);
}

.v-table__count {
    color: rgb(112 114 117);
    text-transform: uppercase;
}
</style>
