<template>
    <ul class="v-sidebar-menu">
        <li class="v-sidebar-menu__item">
            <VBtn :to="{ name: 'created-by-me' }" :icon="VPersonTasksIcon" label="Мои задачи" />
        </li>
        <li class="v-sidebar-menu__item">
            <VBtn :to="{ name: 'created-by-me' }" :icon="VCreatedTasksIcon" label="Созданные мной" />
        </li>
        <li class="v-sidebar-menu__item">
            <VBtn :to="{ name: 'created-by-me' }" :icon="VSharedIcon" label="Доступные для меня" />
        </li>
        <li class="v-sidebar-menu__item">
            <VBtn :to="{ name: 'created-by-me' }" :icon="VBasketIcon" label="Корзина" />
        </li>
    </ul>
</template>

<script setup>
import VBtn from '../../../base/VBtn/VBtn.vue'
import VBasketIcon from '../../../icons/VBasketIcon.vue'
import VSharedIcon from '../../../icons/VSharedIcon.vue'
import VPersonTasksIcon from '../../../icons/VPersonTasksIcon.vue'
import VCreatedTasksIcon from '../../../icons/VCreatedTasksIcon.vue'
</script>

<style>
.v-sidebar-menu {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.v-sidebar-menu__item {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0;
    margin: 0;
}
</style>
