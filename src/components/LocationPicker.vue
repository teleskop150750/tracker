<template>
    <div class="location-picker">
        <div class="location-picker__header">
            <p class="location-picker__label">Местоположение:</p>
            <div class="location-picker__folder">
                <VTag v-if="currentFolder" @delete="onDeleteCurrentFolder">
                    {{ currentFolder.name }}
                </VTag>
            </div>
        </div>
        <VButton v-if="!currentFolder" @click="openPicker" text> Выберите папку </VButton>
        <SelectModal v-if="!currentFolder" v-model:is-open="isOpenSelectModal" :items="items" @select="onSelect">
            <template #item="{ item }">
                <span class="select-modal-folder-option">
                    <span class="select-modal-folder-option__icon-wrapper">
                        <VFolderIcon />
                    </span>
                    <span class="select-modal-folder-option__name">
                        {{ item.name }}
                    </span>
                    <span class="select-modal-folder-option__path">
                        {{ item.path }}
                    </span>
                </span>
            </template>
        </SelectModal>
    </div>
</template>

<script>
import VFolderIcon from './icons/VFolderIcon'
import VTag from './base/VTag/VTag'
import VButton from './base/VButton/VButton'
import SelectModal from '../components/SelectModal'

export default {
    components: {
        VFolderIcon,
        VButton,
        VTag,
        SelectModal,
    },
    data() {
        return {
            isOpenSelectModal: false,
            currentFolder: {
                id: 3,
                name: 'Folder',
            },

            items: [
                {
                    id: 0,
                    name: 'Root',
                    path: '/',
                },
                {
                    id: 1,
                    name: 'Folder',
                    path: 'home/d/f/Folder',
                },
                {
                    id: 2,
                    name: 'home/s/Folder 2',
                },
                {
                    id: 0,
                    name: 'Root',
                    path: '/',
                },
                {
                    id: 1,
                    name: 'Folder',
                    path: 'home/d/f/Folder',
                },
                {
                    id: 2,
                    name: 'home/s/Folder 2',
                },
                {
                    id: 0,
                    name: 'Root',
                    path: '/',
                },
                {
                    id: 1,
                    name: 'Folder',
                    path: 'home/d/f/Folder',
                },
                {
                    id: 2,
                    name: 'home/s/Folder 2',
                },
            ],
        }
    },
    methods: {
        openPicker() {
            this.isOpenSelectModal = true
        },
        onSelect(item) {
            this.isOpenSelectModal = false
            this.currentFolder = item
        },
        onDeleteCurrentFolder() {
            this.currentFolder = null
        },
    },
}
</script>

<style>
.location-picker__header {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: 1rem;
    align-items: center;

    min-height: 24px;
}

.select-modal-folder-option {
    display: grid;
    grid-template-columns: min-content 1fr;

    width: 100%;
    height: 100%;
}

.select-modal-folder-option__icon-wrapper {
    grid-row: 1 / 3;
    grid-column: 1 / 2;

    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;

    width: 24px;
    height: 24px;
    margin-right: 8px;

    color: rgb(0 0 0 / 90%);

    border-radius: 20px;

    background-color: rgb(0 0 0 / 4%);
}

.select-modal-folder-option__icon {
    display: block;

    width: 100%;
    height: 100%;
}

.select-modal-folder-option__name {
    grid-row: 1 / 2;
    grid-column: 2 / 3;

    align-self: flex-end;

    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;

    overflow: hidden;
}

.select-modal-folder-option__path {
    grid-row: 2 / 3;
    grid-column: 2 / 3;

    align-self: flex-start;

    color: rgb(0 0 0 / 56%);
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
}
</style>
