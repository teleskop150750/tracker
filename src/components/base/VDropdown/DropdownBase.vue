<template>
    <div ref="containerRef" :id="uid" class="v-dropdown" :class="containerClass" @click="onContainerClick">
        <div class="v-dropdown__header">
            <input
                v-if="editable"
                :ref="(el) => (inputRef = el)"
                class="v-dropdown__label"
                :value="editableInputValue"
                @focus="onLabelFocus"
                @blur="onLabelBlur"
                @keydown="onLabelKeyDown"
                @input="onEditableInput"
                v-bind="inputAttrs"
            />
            <span
                v-else
                :ref="(el) => (inputRef = el)"
                class="v-dropdown__label"
                @focus="onLabelFocus"
                @blur="onLabelBlur"
                @keydown="onLabelKeyDown"
                v-bind="inputAttrs"
            >
                <slot name="value" :value="modelValue" :placeholder="placeholder">
                    {{ label === undefined ? '&nbsp;' : label || 'empty' }}
                </slot>
            </span>
            <span v-if="showClear && modelValue != null" class="v-dropdown__clear" @click="onClearClick" v-bind="clearIconProps">
                <VCloseIcon />
            </span>
            <div class="v-dropdown__trigger">
                <slot name="indicator">
                    <VArrowDownIcon class="v-dropdown__trigger-icon" aria-hidden="true" />
                </slot>
            </div>
        </div>
        <VPortal :appendTo="appendTo">
            <Transition
                name="v-connected-overlay"
                @enter="onOverlayEnter"
                @after-enter="onOverlayAfterEnter"
                @leave="onOverlayLeave"
                @after-leave="onOverlayAfterLeave"
            >
                <div
                    v-if="overlayVisible"
                    :ref="overlayRefFn"
                    class="v-dropdown__panel"
                    :class="panelClass"
                    :style="panelStyle"
                    @keydown="onOverlayKeyDown"
                    v-bind="panelProps"
                >
                    <span
                        ref="firstHiddenFocusableElementOnOverlayRef"
                        role="presentation"
                        aria-hidden="true"
                        class="v-hidden-accessible v-hidden-focusable"
                        :tabindex="0"
                        @focus="onFirstHiddenFocus"
                    ></span>
                    <slot name="header" :value="modelValue" :options="visibleOptions" />
                    <div v-if="filter" class="v-dropdown__panel-header">
                        <div class="v-dropdown__filter-container">
                            <input
                                type="text"
                                :value="filterValue"
                                @vnode-updated="onFilterUpdated"
                                class="v-dropdown__filter"
                                :placeholder="filterPlaceholder"
                                role="searchbox"
                                autocomplete="off"
                                :aria-owns="`${uid}_list`"
                                :aria-activedescendant="focusedOptionId"
                                @keydown="onFilterKeyDown"
                                @blur="onFilterBlur"
                                @input="onFilterInput"
                                v-bind="filterInputProps"
                            />
                            <span class="v-dropdown__filter-icon pi pi-search"></span>
                        </div>
                        <span role="status" aria-live="polite" class="v-hidden-accessible">
                            {{ filterResultMessageText }}
                        </span>
                    </div>
                    <div class="v-dropdown__panel-items-wrapper" :style="{ 'max-height': virtualScrollerDisabled ? scrollHeight : '' }">
                        <VirtualScroller
                            :ref="virtualScrollerRefFn"
                            v-bind="virtualScrollerOptions"
                            :items="visibleOptions"
                            :style="{ height: scrollHeight }"
                            :tabindex="-1"
                            :disabled="virtualScrollerDisabled"
                        >
                            <template v-slot:content="{ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }">
                                <ul
                                    :ref="(el) => listRefFn(el, contentRef)"
                                    :id="`${uid}_list`"
                                    :class="['v-dropdown-items', styleClass]"
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
                                            class="v-dropdown-item-group"
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
                                                'v-dropdown-item',
                                                {
                                                    'v-highlight': isSelected(option),
                                                    'v-dropdown--focus': focusedOptionIndex === getOptionIndex(i, getItemOptions),
                                                    'v-dropdown--disabled': isOptionDisabled(option),
                                                },
                                            ]"
                                            role="option"
                                            :aria-label="getOptionLabel(option)"
                                            :aria-selected="isSelected(option)"
                                            :aria-disabled="isOptionDisabled(option)"
                                            :aria-setsize="ariaSetSize"
                                            :aria-posinset="getAriaPosInset(getOptionIndex(i, getItemOptions))"
                                            @click="onOptionSelect($event, option)"
                                        >
                                            <slot name="option" :option="option" :index="getOptionIndex(i, getItemOptions)">
                                                {{ getOptionLabel(option) }}
                                            </slot>
                                        </li>
                                    </template>
                                    <li
                                        v-if="filterValue && (!items || (items && items.length === 0))"
                                        class="v-dropdown-empty-message"
                                        role="option"
                                    >
                                        <slot name="emptyfilter">{{ emptyFilterMessage }}</slot>
                                    </li>
                                    <li
                                        v-else-if="!options || (options && options.length === 0)"
                                        class="v-dropdown-empty-message"
                                        role="option"
                                    >
                                        <slot name="empty">{{ emptyMessage }}</slot>
                                    </li>
                                </ul>
                                <span
                                    v-if="!options || (options && options.length === 0)"
                                    role="status"
                                    aria-live="polite"
                                    class="v-hidden-accessible"
                                >
                                    {{ emptyMessage }}
                                </span>
                                <span role="status" aria-live="polite" class="v-hidden-accessible visually-hidden">
                                    {{ selectedMessage }}
                                </span>
                            </template>
                            <template v-if="$slots.loader" v-slot:loader="{ options }">
                                <slot name="loader" :options="options" />
                            </template>
                        </VirtualScroller>
                    </div>
                    <slot name="footer" :value="modelValue" :options="visibleOptions" />
                    <span
                        class="v-hidden-accessible v-hidden-focusable"
                        ref="lastHiddenFocusableElementOnOverlay"
                        role="presentation"
                        aria-hidden="true"
                        :tabindex="0"
                        @focus="onLastHiddenFocus"
                    ></span>
                </div>
            </Transition>
        </VPortal>
    </div>
</template>

<script setup>
import { ConnectedOverlayScrollHandler, ObjectUtils, DomHandler, ZIndexUtils } from '../../utils'
import { getCurrentInstance, ref, watch, computed, useSlots, onUpdated, onBeforeUnmount } from 'vue'
import VirtualScroller from '../VirtualScroller/VirtualScroller'
import VPortal from '../VPortal/VPortal'
import VCloseIcon from '../../icons/VCloseIcon.vue'
import VArrowDownIcon from '../../icons/VArrowDownIcon.vue'
import { useDropdown } from './useDropdown.js'
import { useDropdownSearch } from './useDropdownSearch.js'
import { useDropdownOptions } from './useDropdownOptions.js'
import { useDropdownFocus } from './useDropdownFocus.js'
import { useDropdownFilter } from './useDropdownFilter.js'

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false,
    },
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
    autoOptionLabelFocus: {
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
    ariaLabel: {
        type: String,
        default: null,
    },
    ariaLabelledby: {
        type: String,
        default: null,
    },
})
const emit = defineEmits(['update:modelValue', 'before-show', 'before-hide', 'show', 'hide', 'change', 'filter', 'focus', 'blur'])
const slots = useSlots()

const { updateModelValue } = useDropdown(props, emit)
const {
    selectedMessage,
    isSelected,
    isOptionMatched,
    isOptionDisabled,
    isOptionGroup,
    getOptionRenderKey,
    getOptionLabel,
    getOptionValue,
    getOptionGroupLabel,
    useVisibleOptions,
} = useDropdownOptions(props, emit)
const { searchValue, searchFields } = useDropdownSearch(props, emit)
const { filterValue, getFilterResultMessageText } = useDropdownFilter(props, emit)
const { focused, focusedOptionIndex, focusedOptionId } = useDropdownFocus(props, emit)
const {
    visibleOptions,
    findFirstOptionIndex,
    findLastOptionIndex,
    findNextOptionIndex,
    findPrevOptionIndex,
    findSelectedOptionIndex,
    findFirstFocusedOptionIndex,
    findLastFocusedOptionIndex,
} = useVisibleOptions({
    searchFields,
    filterValue,
})

let outsideClickListener = null
let scrollHandler = null
let searchTimeout = null
let isModelValueChanged = false

const uid = getCurrentInstance().uid
const overlayVisible = ref(false)

// Ref
const containerRef = ref(null)
const inputRef = ref(null)
const overlayRef = ref(null)
const listRef = ref(null)
const firstHiddenFocusableElementOnOverlayRef = ref(null)

function overlayRefFn(el) {
    overlayRef.value = el
}
function listRefFn(el, contentRef) {
    listRef.value = el
    contentRef && contentRef(el) // For VirtualScroller
}
const virtualScrollerRef = ref(null)
function virtualScrollerRefFn(el) {
    virtualScrollerRef.value = el
}

// computed
const containerClass = computed(() => [
    {
        'v-dropdown--disabled': props.disabled,
        'v-dropdown--clearable': props.showClear && !props.disabled,
        'v-dropdown--focus': focused.value,
        'v-dropdown--open': overlayVisible.value,
    },
])
const inputClass = computed(() => [
    props.inputClass,
    {
        'v-dropdown__label-placeholder': !props.editable && label.value === props.placeholder,
        'v-dropdown__label-empty': !props.editable && !slots['value'] && (!label.value || label.value.length === 0),
    },
])

const dropdownIconClass = computed(() => [props.loading ? props.loadingIcon : 'pi pi-chevron-down'])

// text

const label = computed(() => {
    const selectedOptionIndex = findSelectedOptionIndex()

    return selectedOptionIndex !== -1 ? getOptionLabel(visibleOptions.value[selectedOptionIndex]) : props.placeholder || undefined
})

const filterResultMessageText = getFilterResultMessageText(visibleOptions)
const ariaSetSize = computed(() => visibleOptions.value.filter((option) => !isOptionGroup(option)).length)
const virtualScrollerDisabled = computed(() => !props.virtualScrollerOptions)

const inputAttrs = computed(() => {
    let attrs = {
        ...{
            id: props.inputId,
            class: inputClass.value,
            style: props.inputStyle,
            role: 'combobox',
            ariaControls: `${uid}_list`,
            tabindex: props.disabled ? -1 : props.tabindex,
            ariaHaspopup: 'listbox',
            ariaExpanded: overlayVisible.value,
            ariaLabelledby: props.ariaLabelledby,
            ariaActivedescendant: focused.value ? focusedOptionId.value : undefined,
        },
        ...props.inputAttrs,
    }

    if (props.editable) {
        attrs.ariaLabel = props.ariaLabel
        attrs.disabled = props.disabled
        attrs.autocomplete = 'off'
        attrs.placeholder = props.placeholder
        attrs.type = 'text'
    } else {
        attrs.ariaLabel = props.ariaLabel || label.value
        attrs.ariaDisabled = props.disabled
    }

    return attrs
})

// watch
watch(
    () => props.modelValue,
    () => {
        console.log('www')
        isModelValueChanged = true
    }
)
// =====================================
// =====================================
function getOptionIndex(index, fn) {
    return virtualScrollerDisabled.value ? index : fn && fn(index)['index']
}

function getAriaPosInset(index) {
    return (
        (props.optionGroupLabel ? index - visibleOptions.value.slice(0, index).filter((option) => isOptionGroup(option)).length : index) + 1
    )
}
// =====================================
// =====================================

// EditableInput
const editableInputValue = computed(() => {
    const selectedOptionIndex = findSelectedOptionIndex()

    return selectedOptionIndex !== -1 ? getOptionLabel(visibleOptions.value[selectedOptionIndex]) : props.modelValue || ''
})

function onEditableInput(event) {
    const value = event.target.value

    searchValue.value = ''
    const matched = searchOptions(event, value)
    !matched && (focusedOptionIndex.value = -1)

    emit('update:modelValue', value)
}

// function
function onContainerClick(event) {
    if (props.disabled || props.loading) {
        return
    }

    if (DomHandler.hasClass(event.target, 'v-dropdown__clear') || event.target.tagName === 'INPUT') {
        return
    }

    if (!overlayRef.value || !overlayRef.value.contains(event.target)) {
        overlayVisible.value ? hide(true) : show(true)
    }
}

// show / hide
function show(isFocus) {
    emit('before-show')
    overlayVisible.value = true

    if (focusedOptionIndex.value === -1) {
        focusedOptionIndex.value = props.autoOptionLabelFocus ? findFirstFocusedOptionIndex() : -1
    }

    isFocus && inputRef.value.focus()
}

function hide(isFocus) {
    const _hide = () => {
        emit('before-hide')
        overlayVisible.value = false
        focusedOptionIndex.value = -1
        searchValue.value = ''

        isFocus && inputRef.value.focus()
    }

    setTimeout(() => {
        _hide()
    }, 0) // For ScreenReaders
}

// Label Handlers
function onLabelFocus(event) {
    focused.value = true
    focusedOptionIndex.value = overlayVisible.value && props.autoOptionLabelFocus ? findFirstFocusedOptionIndex() : -1
    overlayVisible.value && scrollInView(focusedOptionIndex.value)
    emit('focus', event)
}

function onLabelBlur(event) {
    focused.value = false
    focusedOptionIndex.value = -1
    searchValue.value = ''
    emit('blur', event)
}

function onLabelKeyDown(event) {
    switch (event.code) {
        case 'ArrowDown':
            onArrowDownKey(event)
            break

        case 'ArrowUp':
            onArrowUpKey(event)
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

function onClearClick(event) {
    updateModelValue(event, null)
}

// First / Last Hidden Focus
function onFirstHiddenFocus(event) {
    const relatedTarget = event.relatedTarget

    if (relatedTarget === inputRef.value) {
        const firstFocusableEl = DomHandler.getFirstFocusableElement(overlayRef.value, ':not(.v-hidden-focusable)')
        firstFocusableEl && firstFocusableEl.focus()
    } else {
        inputRef.value.focus()
    }
}

function onLastHiddenFocus() {
    firstHiddenFocusableElementOnOverlayRef.value.focus()
}

function onOptionSelect(event, option) {
    const value = getOptionValue(option)

    updateModelValue(event, value)
    hide(true)
}

// Filter handler
function onFilterInput(event) {
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
            onArrowUpKey(event)
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

// Key handlers
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
    event.preventDefault()
    const optionIndex = focusedOptionIndex.value !== -1 ? findNextOptionIndex(focusedOptionIndex.value) : findFirstFocusedOptionIndex()
    changeFocusedOptionIndex(event, optionIndex)
    !overlayVisible.value && show()
}

function onArrowUpKey(event) {
    event.preventDefault()

    if (event.altKey) {
        if (focusedOptionIndex.value !== -1) {
            onOptionSelect(event, visibleOptions.value[focusedOptionIndex.value])
        }

        overlayVisible.value && hide()
        return
    }

    const optionIndex = focusedOptionIndex.value !== -1 ? findPrevOptionIndex(focusedOptionIndex.value) : findLastFocusedOptionIndex()
    changeFocusedOptionIndex(event, optionIndex)
    !overlayVisible.value && show()
}

function onArrowLeftKey(event, pressedInInputText = false) {
    pressedInInputText && (focusedOptionIndex.value = -1)
}

function onHomeKey(event, pressedInInputText = false) {
    event.preventDefault()

    if (pressedInInputText) {
        event.currentTarget.setSelectionRange(0, 0)
        focusedOptionIndex.value = -1
        return
    }

    changeFocusedOptionIndex(event, findFirstOptionIndex())
    !overlayVisible.value && show()
}

function onEndKey(event, pressedInInputText = false) {
    event.preventDefault()

    if (pressedInInputText) {
        const target = event.currentTarget
        const len = target.value.length
        target.setSelectionRange(len, len)
        focusedOptionIndex.value = -1
        return
    }

    changeFocusedOptionIndex(event, findLastOptionIndex())

    !overlayVisible.value && show()
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
    event.preventDefault()

    if (!overlayVisible.value) {
        onArrowDownKey(event)
        return
    }

    if (focusedOptionIndex.value !== -1) {
        onOptionSelect(event, visibleOptions.value[focusedOptionIndex.value])
    }

    hide()
}

function onSpaceKey(event, pressedInInputText = false) {
    !pressedInInputText && onEnterKey(event)
}

function onEscapeKey(event) {
    event.preventDefault()
    overlayVisible.value && hide(true)
}

function onTabKey(event, pressedInInputText = false) {
    if (pressedInInputText) {
        return
    }

    if (overlayVisible.value && hasFocusableElements()) {
        firstHiddenFocusableElementOnOverlayRef.value.focus()
        event.preventDefault()
        return
    }

    if (focusedOptionIndex.value !== -1) {
        onOptionSelect(event, visibleOptions.value[focusedOptionIndex.value])
    }

    overlayVisible.value && hide(props.filter)
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

    emit('show')
}

function onOverlayLeave() {
    unbindOutsideClickListener()
    unbindScrollListener()

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

function hasFocusableElements() {
    return DomHandler.getFocusableElements(overlayRef.value, ':not(.v-hidden-focusable)').length > 0
}

function searchOptions(event, char) {
    searchValue.value = (searchValue.value || '') + char

    let optionIndex = -1
    let matched = false

    if (focusedOptionIndex.value !== -1) {
        optionIndex = visibleOptions.value.slice(focusedOptionIndex.value).findIndex((option) => isOptionMatched(option, searchValue.value))
        optionIndex =
            optionIndex !== -1
                ? optionIndex + focusedOptionIndex.value
                : visibleOptions.value.slice(0, focusedOptionIndex.value).findIndex((option) => isOptionMatched(option, searchValue.value))
    } else {
        optionIndex = visibleOptions.value.findIndex((option) => isOptionMatched(option, searchValue.value))
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
        searchValue.value = ''
        searchTimeout = null
    }, 500)

    return matched
}

function changeFocusedOptionIndex(event, index) {
    if (focusedOptionIndex.value !== index) {
        focusedOptionIndex.value = index
        scrollInView()
    }
}

function scrollInView(index = -1) {
    const id = index !== -1 ? `${uid}_${index}` : focusedOptionId.value
    const element = DomHandler.findSingle(listRef.value, `li[id="${id}"]`)
    if (element) {
        element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' })
        return
    }

    if (!virtualScrollerDisabled.value) {
        setTimeout(() => {
            virtualScrollerRef.value && virtualScrollerRef.value.scrollToIndex(index !== -1 ? index : focusedOptionIndex.value)
        }, 0)
    }
}

// Lifecycle Hooks
onUpdated(() => {
    if (overlayVisible.value && isModelValueChanged) {
        console.log('onUpdated')
        scrollInView(findSelectedOptionIndex())
    }

    isModelValueChanged = false
})

onBeforeUnmount(() => {
    unbindOutsideClickListener()

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
.v-dropdown {
    display: inline-flex;

    border: 1px solid hsl(210deg 14% 83%);
    border-radius: 4px;

    background: hsl(0deg 0% 100%);

    transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.v-dropdown:not(.v-dropdown--disabled):hover {
    border-color: hsl(210deg 14% 83%);
}

.v-dropdown--focus:not(.v-dropdown--disabled) {
    border-color: hsl(211deg 100% 50%);

    outline: 0 none;
    outline-offset: 0;

    box-shadow: 0 0 0 0.2rem rgb(38 143 255 / 50%);
}

.v-dropdown--clearable .v-dropdown__label {
    padding-right: 1.75rem;
}

.v-dropdown__header {
    position: relative;

    display: inline-flex;

    cursor: pointer;

    user-select: none;
}

.v-dropdown__clear {
    position: absolute;
    top: 50%;
    right: 2.357rem;

    margin-top: -0.5rem;

    color: hsl(210deg 9% 31%);
}

.v-dropdown__trigger {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;

    width: 2.357rem;

    color: hsl(210deg 9% 31%);

    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    background: transparent;
}

.v-dropdown__label {
    display: block;
    flex: 1 1 auto;

    width: 1%;
    padding: 10px;

    white-space: nowrap;
    text-overflow: ellipsis;

    border: 0 none;

    background: transparent;

    cursor: pointer;

    overflow: hidden;
}

.v-dropdown__label:focus,
.v-dropdown__label:enabled:focus {
    outline: 0 none;

    box-shadow: none;
}

.v-dropdown__label-placeholder {
    color: hsl(208deg 7% 46%);
}

.v-dropdown__label-empty {
    opacity: 0;

    overflow: hidden;
}

input.v-dropdown__label {
    cursor: default;
}

.v-dropdown__panel {
    position: absolute;
    top: 0;
    left: 0;

    min-width: 100%;

    color: hsl(210deg 11% 15%);

    border: 1px solid rgb(0 0 0 / 15%);
    border-radius: 4px;

    background: hsl(0deg 0% 100%);

    box-shadow: none;
}

.v-dropdown__panel-header {
    margin: 0;
    padding: 0.75rem 1.5rem;

    color: hsl(210deg 11% 15%);

    border-bottom: 1px solid hsl(210deg 14% 89%);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    background: hsl(0deg 0% 94%);
}

.v-dropdown__panel-items-wrapper {
    overflow: auto;
}

.v-dropdown__filter {
    width: 100%;
    margin-right: -1.75rem;
    padding-right: 1.75rem;
}

.v-dropdown__filter-container {
    position: relative;
}

.v-dropdown__filter-icon {
    position: absolute;
    top: 50%;
    right: 0.75rem;

    margin-top: -0.5rem;

    color: hsl(210deg 9% 31%);
}

.v-dropdown-items {
    margin: 0;
    padding: 0;
    padding: 0.5rem 0;

    list-style-type: none;
}

.v-dropdown-item {
    position: relative;

    margin: 0;
    padding: 0.5rem 1.5rem;

    color: hsl(210deg 11% 15%);
    font-weight: normal;
    white-space: nowrap;

    border: 0 none;
    border-radius: 0;

    background: transparent;

    cursor: pointer;

    overflow: hidden;

    transition: box-shadow 0.15s;
}

.v-dropdown-item.v-highlight {
    color: hsl(0deg 0% 100%);

    background: hsl(211deg 100% 50%);
}

.v-dropdown-item.v-highlight.v-dropdown--focus {
    background: hsl(211deg 100% 42%);
}

.v-dropdown-item:not(.v-highlight, .v-dropdown--disabled).v-dropdown--focus {
    color: hsl(210deg 11% 15%);

    background: hsl(210deg 14% 89%);
}

.v-dropdown-item:not(.v-highlight, .v-dropdown--disabled):hover {
    color: hsl(210deg 11% 15%);

    background: hsl(210deg 16% 93%);
}

.v-dropdown-item--group {
    margin: 0;
    padding: 0.75rem 1rem;

    color: hsl(210deg 11% 15%);
    font-weight: 600;

    background: hsl(0deg 0% 100%);

    cursor: auto;
}

.v-dropdown.v-invalid {
    border-color: hsl(354deg 70% 54%);
}

.v-dropdown-empty-message {
    padding: 0.5rem 1.5rem;

    color: hsl(210deg 11% 15%);

    background: transparent;
}
</style>
