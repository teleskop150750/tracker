<template>
    <div class="v-header-create-dropdown">
        <VPopper offset-distance="18px" placement="bottom-end">
            <VBtn size="sm" round :icon="VPlusIcon" aria-label="Добавить" />
            <template #content="{ close }">
                <div class="v-header-create-dropdown__content">
                    <div class="v-header-create-dropdown__content-body">
                        <VBtn outline full label="Задача" @click="openModalCreateTask(close)" />
                        <VBtn outline full label="Папка" @click="openModalCreateFolder(close)" />
                    </div>
                </div>
            </template>
        </VPopper>
    </div>
    <ModalContentCreateFolder v-model:visible="isOpenModalCreateFolder" />
    <ModalContentCreateTask v-model:visible="isOpenModalCreateTask" />
</template>

<script setup>
import ModalContentCreateFolder from '../../../ModalContentCreateFolder.vue'
import ModalContentCreateTask from '../../../ModalContentCreateTask.vue'
import VPlusIcon from '../../../icons/VPlusIcon.vue'
import VBtn from '../../../base/VBtn/VBtn.vue'
import VPopper from '../../../base/VPopper/VPopper.vue'
import { ref } from 'vue'

const isOpenModalCreateFolder = ref(false)
const isOpenModalCreateTask = ref(false)

function openModalCreateFolder(close) {
    isOpenModalCreateFolder.value = true
    close()
}

function openModalCreateTask(close) {
    isOpenModalCreateTask.value = true
    close()
}
</script>

<style>

.v-header-create-dropdown__content-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;

    width: 12rem;
    padding: 1rem;
}
</style>
