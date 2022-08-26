<template>
    <VPortal :appendTo="appendTo">
        <div ref="maskRef" class="v-dialog-mask" :class="maskClass" v-if="containerVisible" @click.self="close">
            <Transition name="v-dialog" @enter="onEnter" @before-leave="onBeforeLeave" @leave="onLeave" @after-leave="onAfterLeave" appear>
                <VFocusTrap
                    v-if="visible"
                    @deactivate="close"
                    :escape-deactivates="closeOnEscape"
                    :click-outside-deactivates="clickOutside"
                    ref="containerRef"
                    class="v-dialog"
                    :class="dialogClass"
                    v-bind="$attrs"
                    role="dialog"
                    :aria-labelledby="ariaLabelledById"
                    :aria-modal="modal"
                >
                    <div class="v-dialog__header" v-if="showHeader">
                        <div class="v-dialog__header-title-wrapper">
                            <slot name="header" :ariaLabelledById="ariaLabelledById">
                                <span :id="ariaLabelledById" class="v-dialog__header-title" v-if="header">{{ header }}</span>
                            </slot>
                        </div>
                        <div class="v-dialog__header-actions">
                            <button
                                class="v-dialog__header-icon v-dialog__header-maximize v-link"
                                @click="maximize"
                                v-if="maximizable"
                                type="button"
                                round
                                xs="8"
                            >
                                <span :class="maximizeIconClass"></span>
                            </button>
                            <VBtn
                                v-if="closable"
                                class="v-dialog__header-close"
                                @click="close"
                                round
                                size="xs"
                                aria-label="close"
                                :icon="VCloseIcon"
                            />
                        </div>
                    </div>
                    <div class="v-dialog__content" :class="contentClass" :style="contentStyle">
                        <slot />
                    </div>
                    <div class="v-dialog__footer" v-if="footer || $slots.footer">
                        <slot name="footer">{{ footer }}</slot>
                    </div>
                </VFocusTrap>
            </Transition>
        </div>
    </VPortal>
</template>

<script>
export default {
    inheritAttrs: false,
}
</script>

<script setup>
import { computed, getCurrentInstance, ref, watch } from 'vue'
import VFocusTrap from '../VFocusTrap/VFocusTrap'
import VPortal from '../VPortal/VPortal.vue'
import VBtn from '../VBtn/VBtn.vue'
import VCloseIcon from '../../icons/VCloseIcon.vue'

const props = defineProps({
    /**
     * Заголовок содержимого диалогового окна
     */
    header: null,
    /**
     * Содержимое нижнего колонтитула диалогового окна.
     */
    footer: null,
    /**
     * Задает видимость диалогового окна.
     */
    visible: Boolean,
    /**
     * Определяет, должен ли фон блокироваться при отображении диалогового окна.
     */
    modal: Boolean,
    /**
     * Стиль раздела содержимого.
     */
    contentStyle: null,
    /**
     * 	Класс стиля раздела содержимого.
     */
    contentClass: String,
    /**
     * Может ли диалоговое окно отображаться в полноэкранном режиме
     */
    maximizable: Boolean,
    /**
     * Указывает, должен ли щелчок модального фона скрывать диалоговое окно.
     */
    clickOutside: {
        type: [Boolean, Function],
        default: false,
    },
    /**
     * Добавляет значок закрытия в заголовок, чтобы скрыть диалоговое окно.
     */
    closable: {
        type: Boolean,
        default: true,
    },
    closeOnMask: {
        type: Boolean,
        default: true,
    },
    /**
     * Указывает, должно ли нажатие клавиши escape скрывать диалоговое окно
     */
    closeOnEscape: {
        type: Boolean,
        default: true,
    },
    /**
     * Показывать заголовок или нет.
     */
    showHeader: {
        type: Boolean,
        default: true,
    },
    /**
     * 	Положение диалогового окна, опции "center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right".
     */
    position: {
        type: String,
        default: 'center',
        validator: (value) =>
            ['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value),
    },
    appendTo: {
        type: String,
        default: 'body',
    },
})
const emit = defineEmits(['update:visible', 'show', 'hide', 'after-hide', 'maximize', 'unmaximize'])

const ariaId = getCurrentInstance().uid
const maskRef = ref(null)
const containerRef = ref(null)

const containerVisible = ref(false)
watch(
    () => props.visible,
    (newValue) => {
        if (newValue === true) {
            containerVisible.value = true
        }
    }
)

const maximized = ref(false)
let documentKeydownListener = null

const ariaLabelledById = computed(() => ariaId + '_header')
const maskClass = computed(() => [`v-dialog--${props.position}`, { 'v-component-overlay v-component-overlay-enter': props.modal }])
const dialogClass = computed(() => [{ 'v-dialog-maximized': props.maximizable && maximized.value }])
const maximizeIconClass = computed(() => [
    'v-dialog__header-maximize-icon pi',
    { 'pi-window-maximize': !maximized.value, 'pi-window-minimize': maximized.value },
])

function close() {
    emit('update:visible', false)
}

function onEnter() {
    emit('show')
    enableDocumentSettings()
    bindGlobalListeners()
}

function onBeforeLeave() {
    if (props.modal) {
        maskRef.value.classList.add('v-component-overlay-leave')
    }
}

function onLeave() {
    emit('hide')
}

function onAfterLeave() {
    containerVisible.value = false
    unbindDocumentState()
    unbindGlobalListeners()
    emit('after-hide')
}

function bindGlobalListeners() {
    if (props.closeOnEscape) {
        // bindDocumentKeyDownListener()
    }
}
function unbindGlobalListeners() {
    // unbindDocumentKeyDownListener()
}

// function bindDocumentKeyDownListener() {
//     if (!documentKeydownListener) {
//         documentKeydownListener = onKeyDown
//         window.document.addEventListener('keydown', documentKeydownListener)
//     }
// }

// function unbindDocumentKeyDownListener() {
//     if (documentKeydownListener) {
//         window.document.removeEventListener('keydown', documentKeydownListener)
//         documentKeydownListener = null
//     }
// }

// function onKeyDown(event) {
//     if (event.which === 27 && props.closeOnEscape) {
//         close()
//     }
// }

function enableDocumentSettings() {
    if (props.modal || (props.maximizable && maximized.value)) {
        document.body.classList.add('v-overflow-hidden')
    }
}

function unbindDocumentState() {
    if (props.modal || (props.maximizable && maximized.value)) {
        document.body.classList.remove('v-overflow-hidden')
    }
}

function onMaskClick(event) {
    if (props.closeOnMask && props.modal && maskRef.value === event.target) {
        close()
    }
}

function maximize(event) {
    if (maximized.value) {
        maximized.value = false
        emit('unmaximize', event)
    } else {
        maximized.value = true
        emit('maximize', event)
    }

    if (!props.modal) {
        if (maximized.value) {
            document.body.classList.add('v-overflow-hidden')
        } else {
            document.body.classList.remove('v-overflow-hidden')
        }
    }
}
</script>

<style>
@keyframes v-component-overlay-enter-animation {
    from {
        background-color: transparent;
    }

    to {
        background-color: rgb(0 0 0 / 40%);
    }
}
@keyframes v-component-overlay-leave-animation {
    from {
        background-color: rgb(0 0 0 / 40%);
    }

    to {
        background-color: transparent;
    }
}

.v-dialog {
    display: grid;
    grid-template-rows: min-content 1fr min-content;

    width: 100%;
    max-width: 60rem;
    max-height: 90vh;

    border: 1px solid rgb(0 0 0 / 20%);
    border-radius: 4px;

    box-shadow: none;

    transform: scale(1);

    pointer-events: auto;
}

.v-dialog__header {
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;

    padding: 1rem;

    color: hsl(210deg 11% 15%);

    border-bottom: 1px solid hsl(210deg 16% 93%);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    background: hsl(0deg 0% 100%);
}

.v-dialog__header-title {
    font-weight: 600;
    font-size: 1.25rem;
}

.v-dialog__header-actions {
    display: flex;
    align-items: center;
}

.v-dialog__content {
    padding: 1rem;

    color: hsl(210deg 11% 15%);

    background: hsl(0deg 0% 100%);

    overflow-y: auto;
}

.v-dialog__footer {
    padding: 1rem;

    color: hsl(210deg 11% 15%);
    text-align: right;

    border-top: 1px solid hsl(210deg 16% 93%);
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;

    background: hsl(0deg 0% 100%);
}

/* =================== */

.v-dialog-mask {
    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    padding: 1rem;

    pointer-events: none;
}

.v-dialog-mask.v-component-overlay {
    pointer-events: auto;
}

.v-dialog .v-dialog__header-icon {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
}

/* Animation */

/* Center */
.v-dialog-enter-active {
    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
}

.v-dialog-leave-active {
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.v-dialog-enter-from,
.v-dialog-leave-to {
    opacity: 0;
    transform: scale(0.7);
}

/* Top, Bottom, Left, Right, Top* and Bottom* */
.v-dialog--top .v-dialog,
.v-dialog--bottom .v-dialog,
.v-dialog--left .v-dialog,
.v-dialog--right .v-dialog,
.v-dialog--top-left .v-dialog,
.v-dialog--top-right .v-dialog,
.v-dialog--bottom-left .v-dialog,
.v-dialog--bottom-right .v-dialog {
    margin: 0.75rem;

    transform: translate3d(0, 0, 0);
}

.v-dialog--top .v-dialog-enter-active,
.v-dialog--top .v-dialog-leave-active,
.v-dialog--bottom .v-dialog-enter-active,
.v-dialog--bottom .v-dialog-leave-active,
.v-dialog--left .v-dialog-enter-active,
.v-dialog--left .v-dialog-leave-active,
.v-dialog--right .v-dialog-enter-active,
.v-dialog--right .v-dialog-leave-active,
.v-dialog--top-rightleft .v-dialog-enter-active,
.v-dialog--top-rightleft .v-dialog-leave-active,
.v-dialog--top-right .v-dialog-enter-active,
.v-dialog--top-right .v-dialog-leave-active,
.v-dialog--bottom-left .v-dialog-enter-active,
.v-dialog--bottom-left .v-dialog-leave-active,
.v-dialog--bottom-right .v-dialog-enter-active,
.v-dialog--bottom-right .v-dialog-leave-active {
    transition: all 0.3s ease-out;
}

.v-dialog--top .v-dialog-enter-from,
.v-dialog--top .v-dialog-leave-to {
    transform: translate3d(0, -100%, 0);
}

.v-dialog--bottom .v-dialog-enter-from,
.v-dialog--bottom .v-dialog-leave-to {
    transform: translate3d(0, 100%, 0);
}

.v-dialog--left .v-dialog-enter-from,
.v-dialog--left .v-dialog-leave-to,
.v-dialog--top-left .v-dialog-enter-from,
.v-dialog--top-left .v-dialog-leave-to,
.v-dialog--bottom-left .v-dialog-enter-from,
.v-dialog--bottom-left .v-dialog-leave-to {
    transform: translate3d(-100%, 0, 0);
}

.v-dialog--right .v-dialog-enter-from,
.v-dialog--right .v-dialog-leave-to,
.v-dialog--top-right .v-dialog-enter-from,
.v-dialog--top-right .v-dialog-leave-to,
.v-dialog--bottom-right .v-dialog-enter-from,
.v-dialog--bottom-right .v-dialog-leave-to {
    transform: translate3d(100%, 0, 0);
}

/* Maximize */
.v-dialog-maximized {
    top: 0 !important;
    left: 0 !important;

    width: 100vw !important;
    height: 100vh !important;
    height: 100%;
    max-height: 100%;

    transform: none;

    transition: none;
    transition: none;
}

.v-dialog-maximized .v-dialog__content {
    flex-grow: 1;
}

/* Position */
.v-dialog--left {
    justify-content: flex-start;
}

.v-dialog--right {
    justify-content: flex-end;
}

.v-dialog--top {
    align-items: flex-start;
}

.v-dialog--top-left {
    justify-content: flex-start;
    align-items: flex-start;
}

.v-dialog--top-right {
    justify-content: flex-end;
    align-items: flex-start;
}

.v-dialog--bottom {
    align-items: flex-end;
}

.v-dialog--bottom-left {
    justify-content: flex-start;
    align-items: flex-end;
}

.v-dialog--bottom-right {
    justify-content: flex-end;
    align-items: flex-end;
}

.v-component-overlay-enter {
    animation: v-component-overlay-enter-animation 150ms forwards;
}

.v-component-overlay-leave {
    animation: v-component-overlay-leave-animation 150ms forwards;
}
</style>
