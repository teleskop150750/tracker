<template>
    <div class="contact-picker">
        <div class="contact-picker__contacts">
            <template v-for="contact in contacts" :key="contact.id">
                <VTag @delete="onDeleteContact(contact.id)">
                    <VAvatar :size="24">
                        <img src="https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png" alt="avatar" />
                    </VAvatar>
                </VTag>
            </template>
            <button class="contact-picker__add" @click="openPicker" type="button">
                <VPlusIcon />
            </button>
        </div>
        <SelectModal v-model:is-open="isOpenSelectModal" :items="items" @select="onSelect">
            <template #item="{ item }">
                <span class="select-modal-contact-option">
                    <span class="select-modal-contact-option__icon-wrapper">
                        <VAvatar tag="span" :size="32">
                            <img src="https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png" alt="avatar" />
                        </VAvatar>
                    </span>
                    <span class="select-modal-contact-option__name">
                        {{ item.name }}
                    </span>
                </span>
            </template>
        </SelectModal>
    </div>
</template>

<script>
import VAvatar from './base/VAvatar/VAvatar'
import VPlusIcon from './icons/VPlusIcon'
import VTag from './base/VTag/VTag'
import SelectModal from '../components/SelectModal'

export default {
    components: {
        VTag,
        VAvatar,
        SelectModal,
        VPlusIcon,
    },
    data() {
        return {
            isOpenSelectModal: false,
            contacts: [
                {
                    id: 3,
                    name: 'Folder',
                },
            ],

            items: [
                {
                    id: 0,
                    name: 'Root',
                    img: 'https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png',
                },
                {
                    id: 1,
                    name: 'Folder',
                    img: 'https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png',
                },
                {
                    id: 2,
                    name: 'home/s/Folder 2',
                },
                {
                    id: 0,
                    name: 'Root',
                    img: 'https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png',
                },
                {
                    id: 1,
                    name: 'Folder',
                    img: 'https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png',
                },
                {
                    id: 2,
                    name: 'home/s/Folder 2',
                },
                {
                    id: 0,
                    name: 'Root',
                    img: 'https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png',
                },
                {
                    id: 1,
                    name: 'Folder',
                    img: 'https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png',
                },
                {
                    id: 2,
                    name: 'home/s/Folder 2',
                    img: 'https://www.wrike.com/avatars/0E/77/VlSSFt6yC4eA.png',
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
            this.contacts.push(item)
        },
        onDeleteContact(id) {
            this.contacts = this.contacts.filter((item) => item.id !== id)
        },
    },
}
</script>

<style>
.contact-picker__contacts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
}

.contact-picker__add {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 20px;
    height: 20px;
    padding: 0;

    color: var(--v-color-primary);

    border: 0;

    background-color: transparent;
}

.contact-picker__add:focus {
    outline: 0;

    box-shadow: 0 0 0 3px rgb(162 142 255 / 65%);
}

.select-modal-contact-option {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: 0 0.5rem;

    width: 100%;
    height: 100%;
}

.select-modal-contact-option__name {
    grid-column: 2 / 3;

    align-self: center;

    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;

    overflow: hidden;
}
</style>
