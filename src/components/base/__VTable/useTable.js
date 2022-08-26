import { computed } from 'vue'

const getIsRowLeaf = (row) => computed(() => (row.leaf === false ? false : !(row.children && row.children.length)))
const getIsExpanded = (map, key) => computed(() => map[key] === true)

const getIsPartialChecked = (map, key) => computed(() => map[key] && map[key].partialChecked === true)

export const useTable = () => {
    return {
        getIsRowLeaf,
        getIsExpanded,
        getIsPartialChecked,
    }
}
