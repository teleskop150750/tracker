<script>
import VSpinner from '../VSpinner/VSpinner'
import { h, ref, computed, onBeforeUnmount, useSlots, Transition, isVNode } from 'vue'
import { useButtonProps, useButton } from './useButton'
import { stop, prevent, stopAndPrevent, listenOpts, isKeyCode } from './event.js'
import { isObject } from '@vue/shared'

export default {
    props: {
        ...useButtonProps,
    },
    emits: ['click', 'keydown', 'pointerdown', 'keyup'],
    setup(props, { expose, emit }) {
        const { passiveCapture } = listenOpts

        let pointerTarget = null
        let keyboardTarget = null

        const { classes, style, innerClasses, attributes, hasRouterLink, linkTag, navigateToRouterLink, isActionable } = useButton(props)

        const rootRef = ref(null)
        const blurTargetRef = ref(null)

        let localPointerTargetEl = null

        const hasLabel = computed(() => props.label !== null && props.label !== '')

        const onEvents = computed(() => {
            if (props.loading === true) {
                return {
                    onPointerdown: onLoadingEvt,
                    onClick: onLoadingEvt,
                    onKeydown: onLoadingEvt,
                    onKeyup: onLoadingEvt,
                }
            }

            if (isActionable.value === true) {
                return {
                    onClick,
                    onKeydown,
                    onPointerdown,
                }
            }

            return {
                // необходимо; особенно для отключенных тегов <a>
                onClick: stopAndPrevent,
            }
        })

        const nodeProps = computed(() => ({
            ref: rootRef,
            class: 'v-btn ' + classes.value,
            style: style.value,
            ...attributes.value,
            ...onEvents.value,
        }))

        function onClick(event) {
            // он уже уничтожен?
            if (rootRef.value === null) {
                return
            }

            if (event !== void 0) {
                if (event.defaultPrevented === true) {
                    return
                }

                const el = document.activeElement
                // кнопка фокусировки, если она была получена из формы ВВОДА
                // предотвратить новую отправку (уже отправлено)
                if (
                    props.type === 'submit' &&
                    el !== document.body &&
                    rootRef.value.contains(el) === false &&
                    // требуется для iOS и настольного Safari
                    el.contains(rootRef.value) === false
                ) {
                    rootRef.value.focus()

                    const onClickCleanup = () => {
                        document.removeEventListener('keydown', stopAndPrevent, true)
                        document.removeEventListener('keyup', onClickCleanup, passiveCapture)
                        rootRef.value !== null && rootRef.value.removeEventListener('blur', onClickCleanup, passiveCapture)
                    }

                    document.addEventListener('keydown', stopAndPrevent, true)
                    document.addEventListener('keyup', onClickCleanup, passiveCapture)
                    rootRef.value.addEventListener('blur', onClickCleanup, passiveCapture)
                }
            }

            if (hasRouterLink.value === true) {
                const go = () => {
                    event.__qNavigate = true
                    navigateToRouterLink(event)
                }

                emit('click', event, go)
                event.defaultPrevented !== true && go()
            } else {
                emit('click', event)
            }
        }

        function onKeydown(event) {
            // он уже уничтожен?
            if (rootRef.value === null) {
                return
            }

            emit('keydown', event)

            if (event.defaultPrevented === true) {
                return
            }

            if (isKeyCode(event, [13, 32]) === true && keyboardTarget !== rootRef.value) {
                keyboardTarget !== null && cleanup()

                // фокус внешней кнопки, если хелпер фокуса был сфокусирован до этого
                rootRef.value.focus()

                keyboardTarget = rootRef.value
                rootRef.value.classList.add('v-btn--active')
                document.addEventListener('keyup', onPressEnd, true)
                rootRef.value.addEventListener('blur', onPressEnd, passiveCapture)

                stopAndPrevent(event)
            }
        }

        function onPointerdown(event) {
            // он уже уничтожен?
            if (rootRef.value === null) {
                return
            }

            emit('pointerdown', event)

            if (event.defaultPrevented == true) {
                return
            }

            if (pointerTarget !== rootRef.value) {
                pointerTarget !== null && cleanup()
                pointerTarget = rootRef.value

                localPointerTargetEl = event.target
                rootRef.value.classList.add('v-btn--active')
                localPointerTargetEl.addEventListener('pointercancel', onPressEnd, passiveCapture)
                localPointerTargetEl.addEventListener('pointerup', onPressEnd, passiveCapture)
            }
        }

        function onPressEnd(event) {
            // он уже уничтожен?
            if (rootRef.value === null) {
                return
            }

            if (event !== void 0 && event.type === 'keyup') {
                if (keyboardTarget === rootRef.value && isKeyCode(event, [13, 32]) === true) {
                    // для триггера клика)
                    const evt = new MouseEvent('click', event)
                    evt.qKeyEvent = true
                    event.defaultPrevented === true && prevent(evt)
                    event.cancelBubble === true && stop(evt)
                    rootRef.value.dispatchEvent(evt)

                    stopAndPrevent(event)
                }

                emit('keyup', event)
            }

            cleanup()
        }

        function cleanup(destroying) {
            const blurTarget = blurTargetRef.value

            if (destroying !== true && pointerTarget === rootRef.value && blurTarget !== null && blurTarget !== document.activeElement) {
                blurTarget.setAttribute('tabindex', -1)
                blurTarget.focus()
            }

            if (pointerTarget === rootRef.value) {
                if (localPointerTargetEl !== null) {
                    localPointerTargetEl.removeEventListener('pointercancel', onPressEnd, passiveCapture)
                    localPointerTargetEl.removeEventListener('pointerup', onPressEnd, passiveCapture)
                    localPointerTargetEl = null
                }
                pointerTarget = null
            }

            if (keyboardTarget === rootRef.value) {
                document.removeEventListener('keyup', onPressEnd, true)
                rootRef.value !== null && rootRef.value.removeEventListener('blur', onPressEnd, passiveCapture)
                keyboardTarget = null
            }

            rootRef.value !== null && rootRef.value.classList.remove('v-btn--active')
        }

        function onLoadingEvt(event) {
            stopAndPrevent(event)
            event.qSkipRipple = true
        }

        onBeforeUnmount(() => {
            cleanup(true)
        })

        // expose public methods
        expose({ click: onClick, ref: rootRef })

        return () => {
            const slots = useSlots()

            function hMergeSlot(slot, source) {
                return slot !== void 0 ? source.concat(slot()) : source
            }

            let inner = []

            if (props.icon) {
                if (isObject(props.icon)) {
                    inner.push(h(props.icon, { class: 'v-btn__icon' + hasLabel.value === true ? ' v-btn__icon--left' : '' }))
                } else {
                    inner.push(props.icon)
                }
            }

            hasLabel.value === true && inner.push(h('span', { class: 'v-btn__label' }, [props.label]))

            inner = hMergeSlot(slots.default, inner)

            if (props.iconRight !== null && props.round === false) {
                if (isObject(props.iconRight)) {
                    inner.push(h(props.iconRight, { class: 'v-btn__icon' + hasLabel.value === true ? ' v-btn__icon--right' : '' }))
                } else {
                    inner.push(props.iconRight)
                }
            }

            const child = [
                h('span', {
                    class: 'v-btn__focus-helper',
                    ref: blurTargetRef,
                }),
            ]

            child.push(
                h(
                    'span',
                    {
                        class: 'v-btn__content v-anchor--skip ' + innerClasses.value,
                    },
                    inner
                )
            )

            props.loading !== null &&
                child.push(
                    h(
                        Transition,
                        {
                            name: 'v-transition--fade',
                        },
                        () =>
                            props.loading === true
                                ? [
                                      h(
                                          'span',
                                          {
                                              key: 'loading',
                                              class: 'v-btn__loader-wrapper',
                                          },
                                          slots.loading !== void 0 ? slots.loading() : [h(VSpinner)]
                                      ),
                                  ]
                                : null
                    )
                )

            return h(linkTag.value, nodeProps.value, child)
        }
    },
}
</script>

<style>
.v-btn {
    --v-btn-background-color: var(--v-color-primary);
    --v-btn-color: var(--v-color-on-primary);

    position: relative;

    display: inline-flex;
    flex-direction: column;
    align-items: stretch;

    width: auto;
    height: auto;
    min-height: 2.572em;
    padding: 4px 16px;

    color: inherit;
    color: var(--v-btn-color);
    font-weight: 500;
    font-size: 14px;
    line-height: 1.715em;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;

    border: 0;
    border-radius: 3px;

    background-color: var(--v-btn-background-color);

    outline: 0;

    cursor: default;

    user-select: none;
}

.v-btn::focus-visible .v-btn::focus {
    overflow: none;
}

.v-btn .v-icon,
.v-btn .v-spinner {
    font-size: 1.715em;
}

.v-btn--disable {
    opacity: 0.7 !important;
}

.v-btn::before {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: '';

    display: block;

    border-radius: inherit;

    box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
}

.v-btn--actionable {
    cursor: pointer;
}

.v-btn--actionable.v-btn--standard::before {
    transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.v-btn--actionable.v-btn--standard:active::before,
.v-btn--actionable.v-btn--standard.v-btn--active::before {
    box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 5px 8px rgb(0 0 0 / 14%), 0 1px 14px rgb(0 0 0 / 12%);
}

.v-btn--outline {
    --v-btn-background-color: var(--v-color-on-primary);
    --v-btn-color: var(--v-color-primary);

    background: transparent !important;
}

.v-btn--outline::before {
    border: 1px solid currentcolor;
}

.v-btn--rounded {
    border-radius: 28px;
}

.v-btn--round {
    min-width: 3em;
    min-height: 3em;
    padding: 0;

    border-radius: 50%;
}

.v-btn--square {
    border-radius: 0;
}

.v-btn--full {
    display: flex;

    width: 100%;
}

.v-btn--flat {
    --v-btn-color: var(--v-color-primary);

    background: transparent;
}

.v-btn--flat::before,
.v-btn--outline::before,
.v-btn--unelevated::before {
    box-shadow: none;
}

.v-btn--dense {
    min-height: 2em;
    padding: 0.285em;
}

.v-btn--dense.v-btn--round {
    min-width: 2.4em;
    min-height: 2.4em;
    padding: 0;
}

.v-btn__focus-helper {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    border-radius: inherit;

    opacity: 0;

    pointer-events: none;

    transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), opacity 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.v-btn--focusable:focus > .v-btn__focus-helper,
.v-btn--hoverable:hover > .v-btn__focus-helper {
    background: currentcolor;

    opacity: 0.15;
}

.v-btn__content {
    z-index: 0;

    display: flex;
    gap: 0.5rem;
    flex: 10000 1 0%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    text-align: center;

    transition: opacity 0.3s;
}

.v-btn__content--hidden {
    opacity: 0;

    pointer-events: none;
}

.v-btn__content--no-wrap {
    flex-wrap: nowrap;

    white-space: nowrap;
}

.v-btn__icon--left {
    margin-right: 8px;
    margin-left: -6px;
}

.v-btn__icon--right {
    margin-right: -6px;
    margin-left: 8px;
}

.v-btn--dense .v-btn__icon--left {
    margin-right: 6px;
    margin-left: -4px;
}

.v-btn--dense .v-btn__icon--right {
    margin-right: -4px;
    margin-left: 6px;
}

.v-btn__label {
    display: block;
}

.v-btn__loader-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
