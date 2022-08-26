import { computed, ref } from 'vue'
// ============================

export const useDropdownSearch = (props) => {
    const searchValue = ref('')
    const searchFields = computed(() => props.filterFields || [props.optionLabel])

    return {
        searchValue,
        searchFields,
    }
}
