import { computed, ref } from 'vue'

export const useSelectSearch = (props) => {
    const searchValue = ref('')
    const searchFields = computed(() => props.filterFields || [props.optionLabel])

    return {
        searchValue,
        searchFields,
    }
}
