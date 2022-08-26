import { computed } from 'vue'
import { ObjectUtils } from '../../utils/ObjectUtils/ObjectUtils'
import { FilterService } from '../../api/Api'

export const useDropdownOptions = (props, emit) => {
    const hasSelectedOption = computed(() => ObjectUtils.isNotEmpty(props.modelValue))

    const selectedMessage = computed(() => {
        const count = Array.isArray(props.modelValue) ? props.modelValue.length : 1
        return hasSelectedOption.value ? props.selectionMessage.replaceAll('{0}', count) : props.emptySelectionMessage
    })

    const equalityKey = computed(() => (props.optionValue ? null : props.dataKey))

    const maxSelectionLimitReached = computed(
        () => props.selectionLimit && Array.isArray(props.modelValue) && props.modelValue.length === props.selectionLimit
    )

    function isSelected(option) {
        const optionValue = getOptionValue(option)
        const modelValue = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]

        return (modelValue || []).some((value) => ObjectUtils.equals(value, optionValue, equalityKey.value))
    }

    function isOptionGroup(option) {
        return props.optionGroupLabel && option.optionGroup && option.group
    }

    function isOptionDisabled(option) {
        if (maxSelectionLimitReached.value && !isSelected(option)) {
            return true
        }

        return props.optionDisabled ? ObjectUtils.resolveFieldData(option, props.optionDisabled) : false
    }

    function isValidOption(option) {
        return option && !(isOptionDisabled(option) || isOptionGroup(option))
    }

    function isOptionMatched(option, searchValue) {
        return isValidOption(option) && getOptionLabel(option).toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase())
    }

    function isValidSelectedOption(option) {
        return isValidOption(option) && isSelected(option)
    }

    function getOptionLabel(option) {
        return props.optionLabel ? ObjectUtils.resolveFieldData(option, props.optionLabel) : option
    }

    function getOptionValue(option) {
        return props.optionValue ? ObjectUtils.resolveFieldData(option, props.optionValue) : option
    }

    function getOptionRenderKey(option, index) {
        return (props.dataKey ? ObjectUtils.resolveFieldData(option, props.dataKey) : getOptionLabel(option)) + '_' + index
    }

    function getOptionGroupLabel(optionGroup) {
        return ObjectUtils.resolveFieldData(optionGroup, props.optionGroupLabel)
    }

    const useVisibleOptions = ({ searchFields, filterValue }) => {
        const flatOptions = computed(() => (props.optionGroupLabel ? getFlatOptions(props.options) : props.options || []))

        function getFlatOptions(options) {
            return (options || []).reduce((result, option, index) => {
                result.push({ optionGroup: option, group: true, index })

                const optionGroupChildren = getOptionGroupChildren(options)
                optionGroupChildren && optionGroupChildren.forEach((children) => result.push(children))

                return result
            }, [])
        }

        function getOptionGroupChildren(optionGroup) {
            return ObjectUtils.resolveFieldData(optionGroup, props.optionGroupChildren)
        }

        const filteredOptions = computed(() =>
            filterValue.value
                ? FilterService.filter(flatOptions.value, searchFields.value, filterValue.value, props.filterMatchMode)
                : flatOptions.value
        )

        function getAriaPosInset(index) {
            return (
                (props.optionGroupLabel
                    ? index - filteredOptions.value.slice(0, index).filter((option) => isOptionGroup(option)).length
                    : index) + 1
            )
        }

        const allSelected = computed(() => {
            if (props.selectAll !== null) {
                return props.selectAll
            }

            if (
                ObjectUtils.isNotEmpty(filteredOptions.value) &&
                filteredOptions.value.every((option) => isOptionGroup(option) || isValidSelectedOption(option))
            ) {
                return true
            }

            if (ObjectUtils.isNotEmpty(props.modelValue)) {
                return null
            }

            return false
        })

        function findFirstOptionIndex() {
            return filteredOptions.value.findIndex((option) => isValidOption(option))
        }

        function findLastOptionIndex() {
            return filteredOptions.value.findLastIndex((option) => isValidOption(option))
        }

        function findNextOptionIndex(index) {
            const matchedOptionIndex =
                index < filteredOptions.value.length - 1
                    ? filteredOptions.value.slice(index + 1).findIndex((option) => isValidOption(option))
                    : -1
            return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index
        }

        function findPrevOptionIndex(index) {
            const matchedOptionIndex =
                index > 0 ? filteredOptions.value.slice(0, index).findLastIndex((option) => isValidOption(option)) : -1
            return matchedOptionIndex > -1 ? matchedOptionIndex : index
        }

        function findNextSelectedOptionIndex(index) {
            const matchedOptionIndex =
                hasSelectedOption.value && index < filteredOptions.value.length - 1
                    ? filteredOptions.value.slice(index + 1).findIndex((option) => isValidSelectedOption(option))
                    : -1
            return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1
        }

        function findPrevSelectedOptionIndex(index) {
            const matchedOptionIndex =
                hasSelectedOption.value && index > 0
                    ? filteredOptions.value.slice(0, index).findLastIndex((option) => isValidSelectedOption(option))
                    : -1
            return matchedOptionIndex > -1 ? matchedOptionIndex : -1
        }

        function findNearestSelectedOptionIndex(index, firstCheckUp = false) {
            let matchedOptionIndex = -1

            if (hasSelectedOption.value) {
                if (firstCheckUp) {
                    matchedOptionIndex = findPrevSelectedOptionIndex(index)
                    matchedOptionIndex = matchedOptionIndex === -1 ? findNextSelectedOptionIndex(index) : matchedOptionIndex
                } else {
                    matchedOptionIndex = findNextSelectedOptionIndex(index)
                    matchedOptionIndex = matchedOptionIndex === -1 ? findPrevSelectedOptionIndex(index) : matchedOptionIndex
                }
            }

            return matchedOptionIndex > -1 ? matchedOptionIndex : index
        }

        function selectOptionRange(start = -1, end = -1) {
            console.log(start, end)
            start === -1 && (start = findNearestSelectedOptionIndex(end, true))
            end === -1 && (end = findNearestSelectedOptionIndex(start))

            if (start === -1 && end === -1) {
                return null
            }
            const rangeStart = Math.min(start, end)
            const rangeEnd = Math.max(start, end)
            const value = filteredOptions.value
                .slice(rangeStart, rangeEnd + 1)
                .filter((option) => isValidOption(option))
                .map((option) => getOptionValue(option))
            return value
        }

        function findSelectedOptionIndex() {
            return hasSelectedOption.value ? filteredOptions.value.findIndex((option) => isValidSelectedOption(option)) : -1
        }

        function findFirstSelectedOptionIndex() {
            return hasSelectedOption.value ? filteredOptions.value.findIndex((option) => isValidSelectedOption(option)) : -1
        }

        function findLastSelectedOptionIndex() {
            return hasSelectedOption.value ? filteredOptions.value.findLastIndex((option) => isValidSelectedOption(option)) : -1
        }

        function findFirstFocusedOptionIndex() {
            const selectedIndex = props.multiple === false ? findSelectedOptionIndex() : findFirstSelectedOptionIndex()
            return selectedIndex < 0 ? findFirstOptionIndex() : selectedIndex
        }

        function findLastFocusedOptionIndex() {
            const selectedIndex = props.multiple === false ? findSelectedOptionIndex() : findLastSelectedOptionIndex()
            return selectedIndex < 0 ? findLastOptionIndex() : selectedIndex
        }

        function toggleAll() {
            return allSelected.value ? [] : getOptionValueAll()
        }

        function getOptionValueAll() {
            return filteredOptions.value.filter((option) => !isOptionGroup(option)).map((option) => getOptionValue(option))
        }

        return {
            allSelected,
            flatOptions,
            filteredOptions,
            toggleAll,
            getOptionValueAll,
            getAriaPosInset,
            selectOptionRange,
            findFirstOptionIndex,
            findLastOptionIndex,
            findNextOptionIndex,
            findPrevOptionIndex,
            findSelectedOptionIndex,
            findFirstFocusedOptionIndex,
            findLastFocusedOptionIndex,
        }
    }

    return {
        equalityKey,
        selectedMessage,
        isSelected,
        isOptionMatched,
        isOptionDisabled,
        isValidOption,
        isOptionGroup,
        getOptionRenderKey,
        getOptionLabel,
        getOptionValue,
        getOptionGroupLabel,
        useVisibleOptions,
    }
}
