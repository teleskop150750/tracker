<template>
    <aside class="v-sidebar" :class="containerClasses">
        <div class="v-sidebar__inner">
            <slot />
            <VTree :value="nodes" node-key="key" />
            <VSidebarMenu />
        </div>
    </aside>
</template>

<script setup>
import { computed } from 'vue'
import VTree from '../../../base/VTree/VTree'
import VSidebarMenu from './VSidebarMenu.vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
})

const nodes = [
    {
        key: '0',
        label: 'Introduction',
        children: [
            {
                key: '0-0',
                label: 'What is Vue.js?',
                data: 'https://vuejs.org/v2/guide/#What-is-Vue-js',
                type: 'url',
                children: [
                    {
                        key: '0-0-0',
                        label: 'What is Vue.js?',
                        data: 'https://vuejs.org/v2/guide/#What-is-Vue-js',
                        type: 'url',
                    },
                    {
                        key: '0-0-1',
                        label: 'Getting Started',
                        data: 'https://vuejs.org/v2/guide/#Getting-Started',
                        type: 'url',
                    },
                    {
                        key: '0-0-2',
                        label: 'Declarative Rendering',
                        data: 'https://vuejs.org/v2/guide/#Declarative-Rendering',
                        type: 'url',
                    },
                    {
                        key: '0-0-3',
                        label: 'Conditionals and Loops',
                        data: 'https://vuejs.org/v2/guide/#Conditionals-and-Loops',
                        type: 'url',
                    },
                ],
            },
            {
                key: '0-1',
                label: 'Getting Started',
                data: 'https://vuejs.org/v2/guide/#Getting-Started',
                type: 'url',
            },
            {
                key: '0-2',
                label: 'Declarative Rendering',
                data: 'https://vuejs.org/v2/guide/#Declarative-Rendering',
                type: 'url',
            },
            {
                key: '0-3',
                label: 'Conditionals and Loops',
                data: 'https://vuejs.org/v2/guide/#Conditionals-and-Loops',
                type: 'url',
            },
        ],
    },
    {
        key: '1',
        label: 'Components In-Depth',
        children: [
            {
                key: '1-0',
                label: 'Component Registration',
                data: 'https://vuejs.org/v2/guide/components-registration.html',
                type: 'url',
            },
            {
                key: '1-1',
                label: 'Props',
                data: 'https://vuejs.org/v2/guide/components-props.html',
                type: 'url',
            },
            {
                key: '1-2',
                label: 'Custom Events',
                data: 'https://vuejs.org/v2/guide/components-custom-events.html',
                type: 'url',
            },
            {
                key: '1-3',
                label: 'Slots',
                data: 'https://vuejs.org/v2/guide/components-slots.html',
                type: 'url',
            },
        ],
    },
]

const containerClasses = computed(() => [
    {
        'v-sidebar--open': props.isOpen,
    },
])
</script>

<style>
.v-sidebar {
    width: 0;

    color: var(--v-on-container-background-color-dark);

    border-right: 1px solid var(--v-container-border-color-dark);

    background-color: var(--v-container-background-color-dark);

    overflow: hidden;
}

.v-sidebar--open {
    width: 300px;
}

.v-sidebar__inner {
    padding: 1rem;
}
</style>
