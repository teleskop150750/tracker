<template>
    <Teleport to="#app">
        <div v-if="isOpen" class="v-overlay-select-modal">
            <VFocusTrap v-click-outside="close" class="select-modal">
                <div class="select-modal__header">
                    <VTextField v-model.trim="searchText" aria-label="Название папки" placeholder="Название папки" />
                </div>
                <div class="select-modal__body">
                    <ul v-if="filteredItems.length > 0" class="select-modal__list">
                        <li class="select-modal__item" v-for="item in filteredItems" :key="item.id">
                            <button class="select-modal__item-button" type="button" @click="onSelect(item)">
                                <slot name="item" :item="item" />
                            </button>
                        </li>
                    </ul>
                    <div class="select-modal__empty-list" v-else>
                        <p class="select-modal__empty-list-p">Ничего не найдено. Попробуйте использовать другие ключевые слова.s</p>
                    </div>
                </div>
            </VFocusTrap>
        </div>
    </Teleport>
</template>

<script>
import vClickOutside from '../directives/v-click-outside'
import VTextField from './base/VTextField/VTextField'
import VFocusTrap from './base/VFocusTrap/VFocusTrap'

export default {
    components: {
        VTextField,
        VFocusTrap,
    },
    directives: {
        clickOutside: vClickOutside.directive,
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
        items: {
            type: Array,
            default: () => [],
        },
    },
    emits: {
        'update:isOpen': null,
        select: null,
    },
    mounted() {
        this.bindGlobalListeners()
    },
    unmounted() {
        this.unbindGlobalListeners()
    },
    data() {
        return {
            searchText: '',
        }
    },
    computed: {
        filteredItems() {
            const text = this.searchText.toLowerCase()

            return this.items.filter((item) => {
                return item.name.toLowerCase().startsWith(text)
            })
        },
    },
    methods: {
        close() {
            this.$emit('update:isOpen', false)
        },
        onSelect(item) {
            this.$emit('select', item)
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
.v-overlay-select-modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2000;

    display: flex;

    height: 100%;

    overflow: auto;

    pointer-events: none;
}

.select-modal {
    position: relative;

    width: 20rem;
    margin: auto;
    padding: 0;
    box-sizing: border-box;

    border-radius: 2px;

    background: var(--v-container-background-color-light);

    box-shadow: 0 2px 8px 0 hsl(0deg 0% 0% / 16%), 0 0 1px 0 hsl(0deg 0% 0% / 16%);

    pointer-events: all;
}

.select-modal__header {
    padding: 1rem 1rem 0.5rem;
}

.select-modal__body {
    max-height: 20rem;
    padding-bottom: 8px;
    scrollbar-width: thin;

    overflow-y: auto;
}

.select-modal__body::-webkit-scrollbar {
    width: 0.5rem; /* ширина scrollbar */
}

.select-modal__body::-webkit-scrollbar-track {
    background: hsl(220deg 9% 94%); /* цвет дорожки */
}

.select-modal__body::-webkit-scrollbar-thumb {
    border-radius: 20px; /* закругления плашки */

    background-color: hsl(216deg 10% 81%); /* цвет плашки */
}

.select-modal__list {
    margin: 0;
    padding: 0;

    list-style: none;
}

.select-modal__item-button {
    width: 100%;
    min-height: 3.5rem;
    padding: 0 1rem;

    text-align: start;

    border: 0;

    background-color: transparent;

    cursor: pointer;

    user-select: none;
}

.select-modal__item-button:hover {
    background-color: hsl(0deg 0% 96%);
}

.select-modal__item-button:focus-visible {
    outline: none;

    box-shadow: inset 0 0 0 3px rgb(202 191 253 / 75%);
}

.select-modal__empty-list {
    display: block;

    padding: 8px 16px;

    color: rgb(0 0 0 / 56%);
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
}
</style>
