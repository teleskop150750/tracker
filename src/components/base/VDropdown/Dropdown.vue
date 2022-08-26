<template>
    <div ref="containerRef" :id="uid" class="p-dropdown" :class="containerClass" @click="onContainerClick">
        <input
            v-if="editable"
            ref="focusInputRef"
            class="p-dropdown-label"
            :class="inputStyleClass"
            :id="inputId"
            :style="inputStyle"
            :value="editableInputValue"
            :placeholder="placeholder"
            :tabindex="!disabled ? tabindex : -1"
            :disabled="disabled"
            autocomplete="off"
            type="text"
            role="combobox"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            aria-haspopup="listbox"
            :aria-expanded="overlayVisible"
            :aria-controls="uid + '_list'"
            :aria-activedescendant="focused ? focusedOptionId : undefined"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeyDown"
            @input="onEditableInput"
            v-bind="inputProps"
        />
        <span
            v-else
            ref="focusInputRef"
            class="p-dropdown-label"
            :class="inputStyleClass"
            :id="inputId"
            :style="inputStyle"
            :tabindex="!disabled ? tabindex : -1"
            role="combobox"
            :aria-label="ariaLabel || (label === 'p-emptylabel' ? undefined : label)"
            :aria-labelledby="ariaLabelledby"
            aria-haspopup="listbox"
            :aria-expanded="overlayVisible"
            :aria-controls="uid + '_list'"
            :aria-activedescendant="focused ? focusedOptionId : undefined"
            :aria-disabled="disabled"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeyDown"
            v-bind="inputProps"
        >
            <slot name="value" :value="modelValue" :placeholder="placeholder">{{
                label === 'p-emptylabel' ? '&nbsp;' : label || 'empty'
            }}</slot>
        </span>
        <i
            v-if="showClear && modelValue != null"
            class="p-dropdown-clear-icon pi pi-times"
            @click="onClearClick"
            v-bind="clearIconProps"
        ></i>
        <div class="p-dropdown-trigger">
            <slot name="indicator">
                <span class="p-dropdown-trigger-icon" :class="dropdownIconClass" aria-hidden="true"></span>
            </slot>
        </div>
        <Portal :appendTo="appendTo">
            <Transition
                name="p-connected-overlay"
                @enter="onOverlayEnter"
                @after-enter="onOverlayAfterEnter"
                @leave="onOverlayLeave"
                @after-leave="onOverlayAfterLeave"
            >
                <div
                    v-if="overlayVisible"
                    :ref="overlayRefFn"
                    class="p-dropdown-panel"
                    :class="panelStyleClass"
                    :style="panelStyle"
                    @click="onOverlayClick"
                    @keydown="onOverlayKeyDown"
                    v-bind="panelProps"
                >
                    <span
                        ref="firstHiddenFocusableElementOnOverlayRef"
                        role="presentation"
                        aria-hidden="true"
                        class="p-hidden-accessible p-hidden-focusable"
                        :tabindex="0"
                        @focus="onFirstHiddenFocus"
                    ></span>
                    <slot name="header" :value="modelValue" :options="visibleOptions"></slot>
                    <div v-if="filter" class="p-dropdown-header">
                        <div class="p-dropdown-filter-container">
                            <input
                                type="text"
                                ref="filterInput"
                                :value="filterValue"
                                @vnode-updated="onFilterUpdated"
                                class="p-dropdown-filter p-inputtext p-component"
                                :placeholder="filterPlaceholder"
                                role="searchbox"
                                autocomplete="off"
                                :aria-owns="uid + '_list'"
                                :aria-activedescendant="focusedOptionId"
                                @keydown="onFilterKeyDown"
                                @blur="onFilterBlur"
                                @input="onFilterChange"
                                v-bind="filterInputProps"
                            />
                            <span class="p-dropdown-filter-icon pi pi-search"></span>
                        </div>
                        <span role="status" aria-live="polite" class="p-hidden-accessible">
                            {{ filterResultMessageText }}
                        </span>
                    </div>
                    <div class="p-dropdown-items-wrapper" :style="{ 'max-height': virtualScrollerDisabled ? scrollHeight : '' }">
                        <VirtualScroller
                            :ref="virtualScrollerRef"
                            v-bind="virtualScrollerOptions"
                            :items="visibleOptions"
                            :style="{ height: scrollHeight }"
                            :tabindex="-1"
                            :disabled="virtualScrollerDisabled"
                        >
                            <template v-slot:content="{ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }">
                                <ul
                                    :ref="(el) => listRefFn(el, contentRef)"
                                    :id="uid + '_list'"
                                    :class="['p-dropdown-items', styleClass]"
                                    :style="contentStyle"
                                    role="listbox"
                                >
                                    <template
                                        v-for="(option, i) of items"
                                        :key="getOptionRenderKey(option, getOptionIndex(i, getItemOptions))"
                                    >
                                        <li
                                            v-if="isOptionGroup(option)"
                                            :id="uid + '_' + getOptionIndex(i, getItemOptions)"
                                            :style="{ height: itemSize ? itemSize + 'px' : undefined }"
                                            class="p-dropdown-item-group"
                                            role="option"
                                        >
                                            <slot
                                                name="optiongroup"
                                                :option="option.optionGroup"
                                                :index="getOptionIndex(i, getItemOptions)"
                                                >{{ getOptionGroupLabel(option.optionGroup) }}</slot
                                            >
                                        </li>
                                        <li
                                            v-else
                                            :id="uid + '_' + getOptionIndex(i, getItemOptions)"
                                            :style="{ height: itemSize ? itemSize + 'px' : undefined }"
                                            :class="[
                                                'p-dropdown-item',
                                                {
                                                    'p-highlight': isSelected(option),
                                                    'p-focus': focusedOptionIndex === getOptionIndex(i, getItemOptions),
                                                    'p-disabled': isOptionDisabled(option),
                                                },
                                            ]"
                                            role="option"
                                            :aria-label="getOptionLabel(option)"
                                            :aria-selected="isSelected(option)"
                                            :aria-disabled="isOptionDisabled(option)"
                                            :aria-setsize="ariaSetSize"
                                            :aria-posinset="getAriaPosInset(getOptionIndex(i, getItemOptions))"
                                            @click="onOptionSelect($event, option)"
                                            @mousemove="onOptionMouseMove($event, getOptionIndex(i, getItemOptions))"
                                        >
                                            <slot name="option" :option="option" :index="getOptionIndex(i, getItemOptions)">{{
                                                getOptionLabel(option)
                                            }}</slot>
                                        </li>
                                    </template>
                                    <li
                                        v-if="filterValue && (!items || (items && items.length === 0))"
                                        class="p-dropdown-empty-message"
                                        role="option"
                                    >
                                        <slot name="emptyfilter">{{ emptyFilterMessageText }}</slot>
                                    </li>
                                    <li
                                        v-else-if="!options || (options && options.length === 0)"
                                        class="p-dropdown-empty-message"
                                        role="option"
                                    >
                                        <slot name="empty">{{ emptyMessageText }}</slot>
                                    </li>
                                </ul>
                                <span
                                    v-if="!options || (options && options.length === 0)"
                                    role="status"
                                    aria-live="polite"
                                    class="p-hidden-accessible"
                                >
                                    {{ emptyMessageText }}
                                </span>
                                <span role="status" aria-live="polite" class="p-hidden-accessible visually-hidden">
                                    {{ selectedMessageText }}
                                </span>
                            </template>
                            <template v-if="$slots.loader" v-slot:loader="{ options }">
                                <slot name="loader" :options="options"></slot>
                            </template>
                        </VirtualScroller>
                    </div>
                    <slot name="footer" :value="modelValue" :options="visibleOptions"></slot>
                    <span
                        ref="lastHiddenFocusableElementOnOverlay"
                        role="presentation"
                        aria-hidden="true"
                        class="p-hidden-accessible p-hidden-focusable"
                        :tabindex="0"
                        @focus="onLastHiddenFocus"
                    ></span>
                </div>
            </Transition>
        </Portal>
    </div>
</template>

<script setup>
import { ConnectedOverlayScrollHandler, ObjectUtils, DomHandler, ZIndexUtils } from '../../utils'
import { EventBus as EventBusFn } from '../../utils/EventBus/EventBus.js'
import { FilterService } from '../../api/Api'
import { getCurrentInstance, ref, watch, computed, useSlots, onMounted, onUpdated, onBeforeUnmount } from 'vue'
import VirtualScroller from '../VirtualScroller/VirtualScroller'
import Portal from '../VPortal/VPortal'

const EventBus = EventBusFn()

const props = defineProps({
    modelValue: {
        type: null,
        default: null,
    },
    /**
     * Массив данных
     */
    options: {
        type: Array,
        default: () => [],
    },
    optionLabel: null,
    optionValue: null,
    optionDisabled: null,
    optionGroupLabel: null,
    optionGroupChildren: null,
    /**
     * Высота окна просмотра, полоса прокрутки определяется, если высота списка превышает это значение
     */
    scrollHeight: {
        type: String,
        default: '200px',
    },
    /**
     * Если указано, отображает входные данные фильтра в заголовке.
     */
    filter: {
        type: Boolean,
        default: false,
    },
    /**
     * Текст, отображаемый, когда входные данные фильтра пусты
     */
    filterPlaceholder: {
        type: String,
        default: 'Фильтр пуст',
    },
    /**
     * 	Определяет алгоритм фильтрации, используемый при поиске параметров.
     * Допустимыми значениями являются "contains" (по умолчанию), "startsWith" и "endsWith"
     */
    filterMatchMode: {
        type: String,
        validator: (v) => ['contains', 'startsWith', 'endsWith'].includes(v),
        default: 'contains',
    },
    /**
     * Поля, используемые при фильтрации параметров, по умолчанию имеют значение optionLabel
     */
    filterFields: {
        type: Array,
        default: null,
    },
    /**
     * При наличии пользовательское значение вместо предопределенных параметров можно ввести с помощью редактируемого поля ввода
     */
    editable: {
        type: Boolean,
        default: false,
    },
    /**
     * placeholder
     */
    placeholder: {
        type: String,
        default: '',
    },
    /**
     * При наличии указывается, что компонент должен быть отключен.
     */
    disabled: {
        type: Boolean,
        default: false,
    },
    /**
     * Свойство для уникальной идентификации параметра
     */
    dataKey: null,
    /**
     * Если этот параметр включен, отображается четкий значок для очистки значения
     */
    showClear: Boolean,
    inputId: String,
    inputStyle: null,
    inputClass: null,
    inputProps: null,
    panelStyle: null,
    panelClass: null,
    panelProps: null,
    filterInputProps: null,
    clearIconProps: null,
    /**
     * Допустимый селектор запросов или HTMLElement для указания места присоединения наложения.
     * Специальными ключевыми словами являются «body» для тела документа и «self» для самого элемента.
     */
    appendTo: {
        type: String,
        default: 'body',
    },
    /**
     * 	Находится ли раскрывающийся список в состоянии загрузки.
     */
    loading: {
        type: Boolean,
        default: false,
    },
    /**
     * Значок для отображения в состоянии загрузки.
     */
    loadingIcon: {
        type: [String, Object],
        default: 'pi pi-spinner pi-spin',
    },
    /**
     * Следует ли использовать функцию virtualScroller.
     * Свойства компонента VirtualScroller можно использовать как объект в нем.
     */
    virtualScrollerOptions: {
        type: Object,
        default: null,
    },
    /**
     * Следует ли фокусироваться на первом видимом или выбранном элементе при отображении панели наложения.
     */
    autoOptionFocus: {
        type: Boolean,
        default: true,
    },
    /**
     * Текст, отображаемый в скрытом доступном поле при фильтрации, возвращает любые результаты.
     */
    filterMessage: {
        type: String,
        default: '{0} results are available',
    },
    /**
     * Текст, отображаемый в скрытом поле со специальными возможностями при выборе параметров.
     */
    selectionMessage: {
        type: String,
        default: '{0} items selected',
    },
    /**
     * Текст, отображаемый в скрытом поле со специальными возможностями, если какой-либо параметр не выбран.
     */
    emptySelectionMessage: {
        type: String,
        default: 'No selected item',
    },
    /**
     * Текст, отображаемый при фильтрации, не возвращает никаких результатов.
     */
    emptyFilterMessage: {
        type: String,
        default: 'No results found',
    },
    /**
     * Текст, отображаемый при отсутствии доступных параметров.
     */
    emptyMessage: {
        type: String,
        default: 'No available options',
    },
    tabindex: {
        type: Number,
        default: 0,
    },
    'aria-label': {
        type: String,
        default: null,
    },
    'aria-labelledby': {
        type: String,
        default: null,
    },
})
const emit = defineEmits(['update:modelValue', 'before-show', 'before-hide', 'show', 'hide', 'change', 'filter', 'focus', 'blur'])
const slots = useSlots()

let outsideClickListener = null
let scrollHandler = null
let resizeListener = null
let searchTimeout = null
let searchValue = ''
let isModelValueChanged = false
let selectOnFocus = true
let focusOnHover = false

const uid = getCurrentInstance().uid
const focused = ref(false)
const focusedOptionIndex = ref(-1)
const filterValue = ref(null)
const overlayVisible = ref(false)

// Ref
const containerRef = ref(null)
const focusInputRef = ref(null)
const overlayRef = ref(null)
const listRef = ref(null)
const firstHiddenFocusableElementOnOverlayRef = ref(null)

function overlayRefFn(el, contentRef) {
    overlayRef.value = el
}
function listRefFn(el, contentRef) {
    listRef.value = el
    contentRef && contentRef(el) // For VirtualScroller
}
const virtualScrollerRef = ref(null)

// computed
const containerClass = computed(() => [
    {
        'p-disabled': props.disabled,
        'p-dropdown-clearable': props.showClear && !props.disabled,
        'p-focus': focused.value,
        'p-inputwrapper-filled': props.modelValue,
        'p-inputwrapper-focus': focused.value || overlayVisible.value,
        'p-overlay-open': overlayVisible.value,
    },
])
const inputStyleClass = computed(() => [
    props.inputClass,
    {
        'p-placeholder': !props.editable && label.value === props.placeholder,
        'p-dropdown-label-empty': !props.editable && !slots['value'] && (label.value === 'p-emptylabel' || label.value.length === 0),
    },
])
const panelStyleClass = computed(() => [props.panelClass])
const dropdownIconClass = computed(() => [props.loading ? props.loadingIcon : 'pi pi-chevron-down'])

// text
const filterMessageText = computed(() => props.filterMessage)
const emptyFilterMessageText = computed(() => props.emptyFilterMessage)
const emptyMessageText = computed(() => props.emptyMessage)
const selectionMessageText = computed(() => props.selectionMessage)
const emptySelectionMessageText = computed(() => props.emptySelectionMessage)
const selectedMessageText = computed(() =>
    hasSelectedOption.value ? selectionMessageText.value.replaceAll('{0}', '1') : emptySelectionMessageText.value
)

const visibleOptions = computed(() => {
    const options = props.optionGroupLabel ? flatOptions(props.options) : props.options || []

    return filterValue.value
        ? FilterService.filter(options, searchFields.value, filterValue.value, props.filterMatchMode, props.filterLocale)
        : options
})
const hasSelectedOption = computed(() => ObjectUtils.isNotEmpty(props.modelValue))
const label = computed(() => {
    const selectedOptionIndex = findSelectedOptionIndex()

    return selectedOptionIndex !== -1 ? getOptionLabel(visibleOptions.value[selectedOptionIndex]) : props.placeholder || 'p-emptylabel'
})

const editableInputValue = computed(() => {
    const selectedOptionIndex = findSelectedOptionIndex()

    return selectedOptionIndex !== -1 ? getOptionLabel(visibleOptions.value[selectedOptionIndex]) : props.modelValue || ''
})
const equalityKey = computed(() => (props.optionValue ? null : props.dataKey))
const searchFields = computed(() => props.filterFields || [props.optionLabel])
const filterResultMessageText = computed(() =>
    ObjectUtils.isNotEmpty(visibleOptions.value)
        ? filterMessageText.value.replaceAll('{0}', visibleOptions.value.length)
        : emptyFilterMessageText.value
)
const focusedOptionId = computed(() => (focusedOptionIndex.value !== -1 ? `${uid}_${focusedOptionIndex.value}` : null))
const ariaSetSize = computed(() => visibleOptions.value.filter((option) => !isOptionGroup(option)).length)
const virtualScrollerDisabled = computed(() => !props.virtualScrollerOptions)

// watch
watch(
    () => props.modelValue,
    () => {
        isModelValueChanged = true
    }
)

watch(
    () => props.options,
    () => {
        autoUpdateModel()
    }
)

// function
function getOptionIndex(index, fn) {
    return virtualScrollerDisabled.value ? index : fn && fn(index)['index']
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

function isOptionDisabled(option) {
    return props.optionDisabled ? ObjectUtils.resolveFieldData(option, props.optionDisabled) : false
}

function isOptionGroup(option) {
    return props.optionGroupLabel && option.optionGroup && option.group
}

function getOptionGroupLabel(optionGroup) {
    return ObjectUtils.resolveFieldData(optionGroup, props.optionGroupLabel)
}

function getOptionGroupChildren(optionGroup) {
    return ObjectUtils.resolveFieldData(optionGroup, props.optionGroupChildren)
}

function getAriaPosInset(index) {
    return (
        (props.optionGroupLabel ? index - visibleOptions.value.slice(0, index).filter((option) => isOptionGroup(option)).length : index) + 1
    )
}

function show(isFocus) {
    emit('before-show')
    overlayVisible.value = true
    focusedOptionIndex.value =
        focusedOptionIndex.value !== -1 ? focusedOptionIndex.value : props.autoOptionFocus ? findFirstFocusedOptionIndex() : -1

    isFocus && focusInputRef.value.focus()
}

function hide(isFocus) {
    const _hide = () => {
        emit('before-hide')
        overlayVisible.value = false
        focusedOptionIndex.value = -1
        searchValue = ''

        isFocus && focusInputRef.value.focus()
    }

    setTimeout(() => {
        _hide()
    }, 0) // For ScreenReaders
}

function onFocus(event) {
    focused.value = true
    focusedOptionIndex.value = overlayVisible.value && props.autoOptionFocus ? findFirstFocusedOptionIndex() : -1
    overlayVisible.value && scrollInView(focusedOptionIndex.value)
    emit('focus', event)
}
function onBlur(event) {
    focused.value = false
    focusedOptionIndex.value = -1
    searchValue = ''
    emit('blur', event)
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowDown':
            onArrowDownKey(event)
            break

        case 'ArrowUp':
            onArrowUpKey(event, props.editable)
            break

        case 'ArrowLeft':
        case 'ArrowRight':
            onArrowLeftKey(event, props.editable)
            break

        case 'Home':
            onHomeKey(event, props.editable)
            break

        case 'End':
            onEndKey(event, props.editable)
            break

        case 'PageDown':
            onPageDownKey(event)
            break

        case 'PageUp':
            onPageUpKey(event)
            break

        case 'Space':
            onSpaceKey(event, props.editable)
            break

        case 'Enter':
            onEnterKey(event)
            break

        case 'Escape':
            onEscapeKey(event)
            break

        case 'Tab':
            onTabKey(event)
            break

        case 'Backspace':
            onBackspaceKey(event, props.editable)
            break

        case 'ShiftLeft':
        case 'ShiftRight':
            //NOOP
            break

        default:
            if (ObjectUtils.isPrintableCharacter(event.key)) {
                !overlayVisible.value && show()
                !props.editable && searchOptions(event, event.key)
            }

            break
    }
}

function onEditableInput(event) {
    const value = event.target.value

    searchValue = ''
    const matched = searchOptions(event, value)
    !matched && (focusedOptionIndex.value = -1)

    emit('update:modelValue', value)
}

function onContainerClick(event) {
    if (props.disabled || props.loading) {
        return
    }

    if (DomHandler.hasClass(event.target, 'p-dropdown-clear-icon') || event.target.tagName === 'INPUT') {
        return
    } else if (!overlayRef.value || !overlayRef.value.contains(event.target)) {
        overlayVisible.value ? hide(true) : show(true)
    }
}

function onClearClick(event) {
    updateModel(event, null)
}

function onFirstHiddenFocus(event) {
    const relatedTarget = event.relatedTarget

    if (relatedTarget === focusInputRef.value) {
        const firstFocusableEl = DomHandler.getFirstFocusableElement(overlayRef.value, ':not(.p-hidden-focusable)')
        firstFocusableEl && firstFocusableEl.focus()
    } else {
        focusInputRef.value.focus()
    }
}

function onLastHiddenFocus() {
    firstHiddenFocusableElementOnOverlayRef.value.focus()
}

function onOptionSelect(event, option) {
    const value = getOptionValue(option)

    updateModel(event, value)
    hide(true)
}

function onOptionMouseMove(event, index) {
    if (focusOnHover) {
        changeFocusedOptionIndex(event, index)
    }
}

function onFilterChange(event) {
    const value = event.target.value

    filterValue.value = value
    focusedOptionIndex.value = -1
    emit('filter', { originalEvent: event, value })

    !virtualScrollerDisabled.value && virtualScrollerRef.value.scrollToIndex(0)
}

function onFilterKeyDown(event) {
    switch (event.code) {
        case 'ArrowDown':
            onArrowDownKey(event)
            break

        case 'ArrowUp':
            onArrowUpKey(event, true)
            break

        case 'ArrowLeft':
        case 'ArrowRight':
            onArrowLeftKey(event, true)
            break

        case 'Home':
            onHomeKey(event, true)
            break

        case 'End':
            onEndKey(event, true)
            break

        case 'Enter':
            onEnterKey(event)
            break

        case 'Escape':
            onEscapeKey(event)
            break

        case 'Tab':
            onTabKey(event, true)
            break

        default:
            break
    }
}

function onFilterBlur() {
    focusedOptionIndex.value = -1
}

function onFilterUpdated() {
    if (overlayVisible.value) {
        alignOverlay()
    }
}

function onOverlayClick(event) {
    EventBus.emit('overlay-click', {
        originalEvent: event,
        target: containerRef.value,
    })
}

function onOverlayKeyDown(event) {
    switch (event.code) {
        case 'Escape':
            onEscapeKey(event)
            break

        default:
            break
    }
}

function onArrowDownKey(event) {
    const optionIndex = focusedOptionIndex.value !== -1 ? findNextOptionIndex(focusedOptionIndex.value) : findFirstFocusedOptionIndex()

    changeFocusedOptionIndex(event, optionIndex)

    !overlayVisible.value && show()
    event.preventDefault()
}

function onArrowUpKey(event, pressedInInputText = false) {
    if (event.altKey && !pressedInInputText) {
        if (focusedOptionIndex.value !== -1) {
            onOptionSelect(event, visibleOptions.value[focusedOptionIndex.value])
        }

        overlayVisible.value && hide()
        event.preventDefault()
    } else {
        const optionIndex = focusedOptionIndex.value !== -1 ? findPrevOptionIndex(focusedOptionIndex.value) : findLastFocusedOptionIndex()

        changeFocusedOptionIndex(event, optionIndex)

        !overlayVisible.value && show()
        event.preventDefault()
    }
}

function onArrowLeftKey(event, pressedInInputText = false) {
    pressedInInputText && (focusedOptionIndex.value = -1)
}

function onHomeKey(event, pressedInInputText = false) {
    if (pressedInInputText) {
        event.currentTarget.setSelectionRange(0, 0)
        focusedOptionIndex.value = -1
    } else {
        changeFocusedOptionIndex(event, findFirstOptionIndex())
        !overlayVisible.value && show()
    }

    event.preventDefault()
}

function onEndKey(event, pressedInInputText = false) {
    if (pressedInInputText) {
        const target = event.currentTarget
        const len = target.value.length
        target.setSelectionRange(len, len)
        focusedOptionIndex.value = -1
    } else {
        changeFocusedOptionIndex(event, findLastOptionIndex())

        !overlayVisible.value && show()
    }

    event.preventDefault()
}

function onPageUpKey(event) {
    scrollInView(0)
    event.preventDefault()
}

function onPageDownKey(event) {
    scrollInView(visibleOptions.value.length - 1)
    event.preventDefault()
}

function onEnterKey(event) {
    if (!overlayVisible.value) {
        onArrowDownKey(event)
    } else {
        if (focusedOptionIndex.value !== -1) {
            onOptionSelect(event, visibleOptions.value[focusedOptionIndex.value])
        }

        hide()
    }

    event.preventDefault()
}

function onSpaceKey(event, pressedInInputText = false) {
    !pressedInInputText && onEnterKey(event)
}

function onTabKey(event, pressedInInputText = false) {
    if (!pressedInInputText) {
        if (overlayVisible.value && hasFocusableElements()) {
            firstHiddenFocusableElementOnOverlayRef.value.focus()

            event.preventDefault()
        } else {
            if (focusedOptionIndex.value !== -1) {
                onOptionSelect(event, visibleOptions.value[focusedOptionIndex.value])
            }

            overlayVisible.value && hide(props.filter)
        }
    }
}

function onBackspaceKey(event, pressedInInputText = false) {
    if (pressedInInputText) {
        !overlayVisible.value && show()
    }
}

function onOverlayEnter(el) {
    ZIndexUtils.set('overlay', el, 1000)
    alignOverlay()
    scrollInView()
}

function onOverlayAfterEnter() {
    bindOutsideClickListener()
    bindScrollListener()
    bindResizeListener()

    emit('show')
}

function onOverlayLeave() {
    unbindOutsideClickListener()
    unbindScrollListener()
    unbindResizeListener()

    emit('hide')
    overlayRef.value = null
}

function onOverlayAfterLeave(el) {
    ZIndexUtils.clear(el)
}

function alignOverlay() {
    if (props.appendTo === 'self') {
        DomHandler.relativePosition(overlayRef.value, containerRef.value)
    } else {
        overlayRef.value.style.minWidth = DomHandler.getOuterWidth(containerRef.value) + 'px'
        DomHandler.absolutePosition(overlayRef.value, containerRef.value)
    }
}

function bindOutsideClickListener() {
    if (!outsideClickListener) {
        outsideClickListener = (event) => {
            if (
                overlayVisible.value &&
                overlayRef.value &&
                !containerRef.value.contains(event.target) &&
                !overlayRef.value.contains(event.target)
            ) {
                hide()
            }
        }
        document.addEventListener('click', outsideClickListener)
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener) {
        document.removeEventListener('click', outsideClickListener)
        outsideClickListener = null
    }
}

function bindScrollListener() {
    if (!scrollHandler) {
        scrollHandler = new ConnectedOverlayScrollHandler(containerRef.value, () => {
            if (overlayVisible.value) {
                hide()
            }
        })
    }

    scrollHandler.bindScrollListener()
}

function unbindScrollListener() {
    if (scrollHandler) {
        scrollHandler.unbindScrollListener()
    }
}

function bindResizeListener() {
    if (!resizeListener) {
        resizeListener = () => {
            if (overlayVisible.value && !DomHandler.isTouchDevice()) {
                hide()
            }
        }
        window.addEventListener('resize', resizeListener)
    }
}

function unbindResizeListener() {
    if (resizeListener) {
        window.removeEventListener('resize', resizeListener)
        resizeListener = null
    }
}

function hasFocusableElements() {
    return DomHandler.getFocusableElements(overlayRef.value, ':not(.p-hidden-focusable)').length > 0
}

function isOptionMatched(option) {
    return isValidOption(option) && getOptionLabel(option).toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase())
}

function isValidOption(option) {
    return option && !(isOptionDisabled(option) || isOptionGroup(option))
}

function isValidSelectedOption(option) {
    return isValidOption(option) && isSelected(option)
}

function isSelected(option) {
    return ObjectUtils.equals(props.modelValue, getOptionValue(option), equalityKey.value)
}

function findFirstOptionIndex() {
    return visibleOptions.value.findIndex((option) => isValidOption(option))
}

function findLastOptionIndex() {
    return visibleOptions.value.findLastIndex((option) => isValidOption(option))
}

function findNextOptionIndex(index) {
    const matchedOptionIndex =
        index < visibleOptions.value.length - 1 ? visibleOptions.value.slice(index + 1).findIndex((option) => isValidOption(option)) : -1
    return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index
}

function findPrevOptionIndex(index) {
    const matchedOptionIndex = index > 0 ? visibleOptions.value.slice(0, index).findLastIndex((option) => isValidOption(option)) : -1
    return matchedOptionIndex > -1 ? matchedOptionIndex : index
}

function findSelectedOptionIndex() {
    return hasSelectedOption.value ? visibleOptions.value.findIndex((option) => isValidSelectedOption(option)) : -1
}

function findFirstFocusedOptionIndex() {
    const selectedIndex = findSelectedOptionIndex()
    return selectedIndex < 0 ? findFirstOptionIndex() : selectedIndex
}

function findLastFocusedOptionIndex() {
    const selectedIndex = findSelectedOptionIndex()
    return selectedIndex < 0 ? findLastOptionIndex() : selectedIndex
}

function searchOptions(event, char) {
    searchValue = (searchValue || '') + char

    let optionIndex = -1
    let matched = false

    if (focusedOptionIndex.value !== -1) {
        optionIndex = visibleOptions.value.slice(focusedOptionIndex.value).findIndex((option) => isOptionMatched(option))
        optionIndex =
            optionIndex === -1
                ? visibleOptions.value.slice(0, focusedOptionIndex.value).findIndex((option) => isOptionMatched(option))
                : optionIndex + focusedOptionIndex.value
    } else {
        optionIndex = visibleOptions.value.findIndex((option) => isOptionMatched(option))
    }

    if (optionIndex !== -1) {
        matched = true
    }

    if (optionIndex === -1 && focusedOptionIndex.value === -1) {
        optionIndex = findFirstFocusedOptionIndex()
    }

    if (optionIndex !== -1) {
        changeFocusedOptionIndex(event, optionIndex)
    }

    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(() => {
        searchValue = ''
        searchTimeout = null
    }, 500)

    return matched
}

function changeFocusedOptionIndex(event, index) {
    if (focusedOptionIndex.value !== index) {
        focusedOptionIndex.value = index
        scrollInView()

        if (selectOnFocus) {
            // alert('11')
            updateModel(event, getOptionValue(visibleOptions.value[index]))
        }
    }
}

function scrollInView(index = -1) {
    const id = index !== -1 ? `${uid}_${index}` : focusedOptionId.value
    const element = DomHandler.findSingle(listRef.value, `li[id="${id}"]`)
    if (element) {
        element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' })
    } else if (!virtualScrollerDisabled.value) {
        setTimeout(() => {
            virtualScrollerRef.value && virtualScrollerRef.value.scrollToIndex(index !== -1 ? index : focusedOptionIndex.value)
        }, 0)
    }
}

function autoUpdateModel() {
    if (selectOnFocus && props.autoOptionFocus && !hasSelectedOption.value) {
        // alert('11')
        focusedOptionIndex.value = findFirstFocusedOptionIndex()
        const value = getOptionValue(visibleOptions.value[focusedOptionIndex.value])
        updateModel(null, value)
    }
}

function updateModel(event, value) {
    emit('update:modelValue', value)
    emit('change', { originalEvent: event, value })
}

function flatOptions(options) {
    return (options || []).reduce((result, option, index) => {
        result.push({ optionGroup: option, group: true, index })

        const optionGroupChildren = getOptionGroupChildren(option)
        optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o))

        return result
    }, [])
}

// Lifecycle Hooks
onMounted(() => {
    autoUpdateModel()
})

onUpdated(() => {
    if (overlayVisible.value && isModelValueChanged) {
        scrollInView(findSelectedOptionIndex())
    }

    isModelValueChanged = false
})

onBeforeUnmount(() => {
    unbindOutsideClickListener()
    unbindResizeListener()

    if (scrollHandler) {
        scrollHandler.destroy()
        scrollHandler = null
    }

    if (overlayRef.value) {
        ZIndexUtils.clear(overlayRef.value)
        overlayRef.value = null
    }
})
</script>

<style>
.p-dropdown {
    position: relative;

    display: inline-flex;

    cursor: pointer;

    user-select: none;
}

.p-dropdown-clear-icon {
    position: absolute;
    top: 50%;

    margin-top: -0.5rem;
}

.p-dropdown-trigger {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
}

.p-dropdown-label {
    display: block;
    flex: 1 1 auto;

    width: 1%;

    white-space: nowrap;
    text-overflow: ellipsis;

    cursor: pointer;

    overflow: hidden;
}

.p-dropdown-label-empty {
    opacity: 0;

    overflow: hidden;
}

input.p-dropdown-label {
    cursor: default;
}

.p-dropdown .p-dropdown-panel {
    min-width: 100%;
}

.p-dropdown-panel {
    position: absolute;
    top: 0;
    left: 0;
}

.p-dropdown-items-wrapper {
    overflow: auto;
}

.p-dropdown-item {
    position: relative;

    font-weight: normal;
    white-space: nowrap;

    cursor: pointer;

    overflow: hidden;
}

.p-dropdown-item-group {
    cursor: auto;
}

.p-dropdown-items {
    margin: 0;
    padding: 0;

    list-style-type: none;
}

.p-dropdown-filter {
    width: 100%;
}

.p-dropdown-filter-container {
    position: relative;
}

.p-dropdown-filter-icon {
    position: absolute;
    top: 50%;

    margin-top: -0.5rem;
}

.p-fluid .p-dropdown {
    display: flex;
}

.p-fluid .p-dropdown .p-dropdown-label {
    width: 1%;
}

.p-dropdown {
    border: 1px solid hsl(210deg 14% 83%);
    border-radius: 4px;

    background: hsl(0deg 0% 100%);

    transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.p-dropdown:not(.p-disabled):hover {
    border-color: hsl(210deg 14% 83%);
}

.p-dropdown:not(.p-disabled).p-focus {
    border-color: hsl(211deg 100% 50%);

    outline: 0 none;
    outline-offset: 0;

    box-shadow: 0 0 0 0.2rem rgb(38 143 255 / 50%);
}

.p-dropdown.p-dropdown-clearable .p-dropdown-label {
    padding-right: 1.75rem;
}

.p-dropdown .p-dropdown-label {
    border: 0 none;

    background: transparent;
}

.p-dropdown .p-dropdown-label.p-placeholder {
    color: hsl(208deg 7% 46%);
}

.p-dropdown .p-dropdown-label:focus,
.p-dropdown .p-dropdown-label:enabled:focus {
    outline: 0 none;

    box-shadow: none;
}

.p-dropdown .p-dropdown-trigger {
    width: 2.357rem;

    color: hsl(210deg 9% 31%);

    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    background: transparent;
}

.p-dropdown .p-dropdown-clear-icon {
    right: 2.357rem;

    color: hsl(210deg 9% 31%);
}

.p-dropdown.p-invalid.p-component {
    border-color: hsl(354deg 70% 54%);
}

.p-dropdown-panel {
    color: hsl(210deg 11% 15%);

    border: 1px solid rgb(0 0 0 / 15%);
    border-radius: 4px;

    background: hsl(0deg 0% 100%);

    box-shadow: none;
}

.p-dropdown-panel .p-dropdown-header {
    margin: 0;
    padding: 0.75rem 1.5rem;

    color: hsl(210deg 11% 15%);

    border-bottom: 1px solid hsl(210deg 14% 89%);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    background: hsl(0deg 0% 94%);
}

.p-dropdown-panel .p-dropdown-header .p-dropdown-filter {
    margin-right: -1.75rem;
    padding-right: 1.75rem;
}

.p-dropdown-panel .p-dropdown-header .p-dropdown-filter-icon {
    right: 0.75rem;

    color: hsl(210deg 9% 31%);
}

.p-dropdown-panel .p-dropdown-items {
    padding: 0.5rem 0;
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item {
    margin: 0;
    padding: 0.5rem 1.5rem;

    color: hsl(210deg 11% 15%);

    border: 0 none;
    border-radius: 0;

    background: transparent;

    transition: box-shadow 0.15s;
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    color: hsl(0deg 0% 100%);

    background: hsl(211deg 100% 50%);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight.p-focus {
    background: hsl(211deg 100% 42%);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight, .p-disabled).p-focus {
    color: hsl(210deg 11% 15%);

    background: hsl(210deg 14% 89%);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight, .p-disabled):hover {
    color: hsl(210deg 11% 15%);

    background: hsl(210deg 16% 93%);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item-group {
    margin: 0;
    padding: 0.75rem 1rem;

    color: hsl(210deg 11% 15%);
    font-weight: 600;

    background: hsl(0deg 0% 100%);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-empty-message {
    padding: 0.5rem 1.5rem;

    color: hsl(210deg 11% 15%);

    background: transparent;
}

.p-input-filled .p-dropdown {
    background: hsl(0deg 0% 94%);
}

.p-input-filled .p-dropdown:not(.p-disabled):hover {
    background-color: hsl(0deg 0% 94%);
}

.p-input-filled .p-dropdown:not(.p-disabled).p-focus {
    background-color: hsl(0deg 0% 94%);
}

.p-input-filled .p-dropdown:not(.p-disabled).p-focus .p-inputtext {
    background-color: transparent;
}
</style>
