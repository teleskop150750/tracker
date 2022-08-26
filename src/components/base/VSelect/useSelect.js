export const useSelect = (props, emit) => {
    const updateModelValue = (value) => {
        emit('update:modelValue', value)
        emit('change',value)
    }

    return {
        updateModelValue,
    }
}
