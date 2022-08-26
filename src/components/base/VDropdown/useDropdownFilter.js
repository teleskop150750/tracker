import { ref, computed } from 'vue'

export const useDropdownFilter = (props, emit) => {
    const filterValue = ref(null)
    
    function getFilterResultMessage(visibleOptions) {
        computed(() =>
            ObjectUtils.isNotEmpty(visibleOptions.value)
                ? props.filterMessage.replaceAll('{0}', visibleOptions.value.length)
                : props.emptyFilterMessage
        )
    }

    return {
        filterValue,
        getFilterResultMessage,
    }
}
