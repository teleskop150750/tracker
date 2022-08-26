import { ref, computed, getCurrentInstance } from 'vue'
// ============================

export const useDropdownFocus = (props, emit) => {
    const uid = getCurrentInstance().uid
    const focused = ref(false)
    const focusedOptionIndex = ref(-1)
    const focusedOptionId = computed(() => (focusedOptionIndex.value === -1 ? null : `${uid}_${focusedOptionIndex.value}`))

    return {
        focused,
        focusedOptionIndex,
        focusedOptionId,
    }
}
