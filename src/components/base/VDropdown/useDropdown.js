export const useDropdown = (props, emit) => {
    const updateModelValue = (value) => {
        emit('update:modelValue', value)
        emit('change',value)
    }

    return {
        updateModelValue,
    }
}
