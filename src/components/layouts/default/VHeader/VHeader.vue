<template>
    <header class="v-header">
        <div class="v-header__container">
            <div class="v-header__left">
                <VBtn size="sm" round :icon="burgerMenuIcon" aria-label="Меню" @click="toggleSidebar" />
                <VBtn size="sm" round :icon="homeIcon" link :to="{ name: 'home' }" aria-label="Домашняя страница" />
            </div>
            <div class="v-header__right">
                <VTextField dark aria-label="Поиск" placeholder="поиск" />
                <VHeaderCreateDropdown />
                <VHeaderUserDropdown />
            </div>
        </div>
    </header>
</template>

<script>
import VHeaderCreateDropdown from './VHeaderCreateDropdown.vue'
import VHeaderUserDropdown from './VHeaderUserDropdown.vue'
import VBtn from '../../../base/VBtn/VBtn'
import VTextField from '../../../base/VTextField/VTextField'
import VBurgerMenuIcon from '../../../icons/VBurgerMenuIcon'
import VHomeIcon from '../../../icons/VHomeIcon'

export default {
    components: {
        VHeaderCreateDropdown,
        VHeaderUserDropdown,
        VTextField,
        VBtn,
    },
    props: {
        isOpenSidebar: {
            type: Boolean,
            default: false,
        },
    },
    emits: {
        'update:isOpenSidebar': null,
    },
    computed: {
        burgerMenuIcon() {
            return VBurgerMenuIcon
        },
        homeIcon() {
            return VHomeIcon
        },
    },
    methods: {
        toggleSidebar() {
            this.$emit('update:isOpenSidebar', !this.isOpenSidebar)
        },
    },
}
</script>

<style>
.v-header {
    padding: 1rem 0;

    color: var(--v-on-container-background-color-dark);

    border-bottom: 1px solid var(--v-container-border-color-dark);

    background-color: var(--v-container-background-color-dark);
}

.v-header__container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    padding: 0 1rem;
}

.v-header__left {
    display: grid;
    grid-template-columns: min-content min-content;
    gap: 0.5rem;
    align-items: center;
}

.v-header__right {
    display: grid;
    grid-template-columns: 200px min-content min-content;
    gap: 0.5rem;
    justify-content: flex-end;
    align-items: center;
}
</style>
