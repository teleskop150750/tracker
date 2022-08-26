<template>
    <Teleport to="#app">
        <VFocusTrap v-if="isOpen" class="v-overlay-modal" @click.self="close">
            <div class="v-modal" role="dialog" aria-modal="true">
                <div class="v-modal__header">
                    <slot name="header" />
                    <button aria-label="Close this dialog" class="v-modal__header-btn-close" type="button" @click="close">
                        <VCloseIcon />
                    </button>
                </div>
                <div class="v-modal__body">
                    <slot />
                </div>
                <footer v-if="$slots['footer']" class="v-modal__footer">
                    <slot name="footer" />
                </footer>
            </div>
        </VFocusTrap>
    </Teleport>
</template>

<script>
import VFocusTrap from '../VFocusTrap/VFocusTrap'
import VCloseIcon from '../../icons/VCloseIcon'

export default {
    components: {
        VCloseIcon,
        VFocusTrap,
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
    },
    emits: {
        'update:isOpen': null,
    },
    documentKeydownListener: null,
    mounted() {
        this.bindGlobalListeners()
    },
    unmounted() {
        this.unbindGlobalListeners()
    },
    methods: {
        close() {
            this.$emit('update:isOpen', false)
        },
        bindGlobalListeners() {
            this.bindDocumentKeyDownListener()
        },
        unbindGlobalListeners() {
            this.unbindDocumentKeyDownListener()
        },
        bindDocumentKeyDownListener() {
            if (!this.documentKeydownListener) {
                this.documentKeydownListener = this.onKeyDown.bind(this)
                window.document.addEventListener('keydown', this.documentKeydownListener)
            }
        },
        unbindDocumentKeyDownListener() {
            if (this.documentKeydownListener) {
                window.document.removeEventListener('keydown', this.documentKeydownListener)
                this.documentKeydownListener = null
            }
        },
        onKeyDown(event) {
            if (event.key === 'Escape') {
                this.close()
            }
        },
    },
}
</script>

<style>
.v-overlay-modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2000;

    display: flex;

    height: 100%;
    padding: 2rem 1rem;

    background-color: rgb(0 0 0 / 50%);

    overflow: auto;
}

.v-modal {
    position: relative;

    width: 50%;
    margin: auto;
    box-sizing: border-box;

    border-radius: 4px;

    background: var(--v-container-background-color-light);

    box-shadow: 0 12px 32px 4px rgb(0 0 0 / 4%), 0 8px 20px rgb(0 0 0 / 8%);
}

.v-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0.5rem 1rem;

    border-bottom: 1px solid hsl(0deg 0% 93%);
}

.v-modal__header-btn-close {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 24px;
    height: 24px;
    padding: 0;

    border: 0;
    border-radius: 4px;

    background-color: transparent;

    cursor: pointer;
}

.v-modal__header-btn-close:focus {
    outline: 0;

    box-shadow: 0 0 0 3px rgb(162 142 255 / 65%);
}

.v-modal__footer {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-start;

    padding: 0.5rem 1rem;

    border-top: 1px solid hsl(0deg 0% 93%);
}

.v-modal__body {
    position: relative;

    padding: 1rem;
}

.btn-close {
    padding: 20px;

    color: hsl(169deg 40% 49%);
    font-weight: bold;
    font-size: 20px;

    border: none;

    background: transparent;

    cursor: pointer;
}

.btn-green {
    color: white;

    border: 1px solid hsl(169deg 40% 49%);
    border-radius: 2px;

    background: hsl(169deg 40% 49%);
}
</style>
