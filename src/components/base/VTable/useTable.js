import { computed } from 'vue'

export const useTable = (props, emit) => {
    const computedRows = computed(() => {
        const items = [...props.rows]
        computeRowDecorator()(items)

        return items
    })

    const flatRows = computed(() => treeToArray(computedRows.value))
    const selectableRows = computed(() => flatRows.value.filter((row) => row._canSelect === true))

    const getRowKey = computed(() => (typeof props.rowKey === 'function' ? props.rowKey : (row) => row[props.rowKey]))

    // select
    const selectedKeys = computed(() => {
        const keys = {}
        props.selected.map(getRowKey.value).forEach((key) => {
            keys[key] = true
        })
        return keys
    })

    const allRowsSelected = computed(
        () => flatRows.value.length > 0 && flatRows.value.every((row) => selectedKeys.value[getRowKey.value(row)] === true)
    )

    const someRowsSelected = computed(
        () => allRowsSelected.value !== true && flatRows.value.some((row) => selectedKeys.value[getRowKey.value(row)] === true)
    )

    const rowsSelectedNumber = computed(() => props.selected.length)

    function isRowSelected(key) {
        return selectedKeys.value[key] === true
    }

    function clearSelection() {
        emit('update:selected', [])
    }

    function updateSelection(keys, rows, added) {
        emit('selection', { rows, added, keys })
        console.log(keys, rows, added)

        const payload =
            added === true
                ? props.selected.concat(rows)
                : props.selected.filter((row) => keys.includes(getRowKey.value(row)) === false && row._canSelect === true)

        console.log(payload)
        emit('update:selected', payload)
    }

    // ============
    const getIsRowLeaf = (row) => computed(() => (row.leaf === false ? false : !(row.children && row.children.length)))
    const getIsExpanded = (map, key) => computed(() => map[key] === true)
    const getIsPartialChecked = (map, key) => computed(() => map[key] && map[key].partialChecked === true)

    function computeRowDecorator() {
        let index = 0

        const computeRow = (rows) => {
            rows.forEach((row) => {
                index += 1
                row._index = index
                row._canSelect = props.canSelectRow(row)

                if (row[props.childrenField] && row[props.childrenField].length > 0) {
                    computeRow(row[props.childrenField])
                }
            })
        }

        return computeRow
    }

    function treeToArray(list) {
        let result = []
        list.forEach((item) => {
            result.push(item)
            if (item[props.childrenField] && item[props.childrenField].length > 0) {
                result = result.concat(treeToArray(item[props.childrenField]))
            }
        })
        return result
    }

    return {
        flatRows,
        selectableRows,
        computedRows,
        setRowIndexDecorator: computeRowDecorator,
        getRowKey,

        getIsRowLeaf,
        getIsExpanded,
        getIsPartialChecked,
        // select
        selectedKeys,
        allRowsSelected,
        someRowsSelected,
        rowsSelectedNumber,
        isRowSelected,
        clearSelection,
        updateSelection,
    }
}
