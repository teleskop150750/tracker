<template>
    <div>
        <button type="button" class="btn" @click="showModal">Open Modal!</button>
        <button type="button" class="btn" @click="isModalVisible2 = true">Open Modal!</button>
        <button type="button" class="btn" @click="isFolderOpen = true">isFolderOpen!</button>

        <VModal v-model:is-open="isModalVisible">
            <template #header>
                <VTitle class="v-modal__header--title">Создать папку</VTitle>
            </template>
            <ModalContentNewFolder />
            <template #footer>
                <VButton>Создать</VButton>
                <VButton>Отмена</VButton>
            </template>
        </VModal>

        <VModal v-model:is-open="isModalVisible2">
            <template #header>
                <VTitle class="v-modal__header--title">Создать задачу</VTitle>
            </template>
            <ModalContentNewTask />
            <template #footer>
                <VButton>Создать</VButton>
                <VButton>Отмена</VButton>
            </template>
        </VModal>
    </div>
    <div>
        <div style="padding: 10px">
            <StatusWidget />
        </div>
        <div>23</div>
    </div>
</template>

<script>
import ModalContentNewFolder from '../components/ModalContentNewFolder'
import ModalContentNewTask from '../components/ModalContentNewTask'
import StatusWidget from '../components/StatusWidget/StatusWidget'
import VButton from '../components/base/VButton/VButton'
import VModal from '../components/base/VModal/VModal'
import VTitle from '../components/base/VTitle/VTitle'
export default {
    components: {
        VModal,
        VTitle,
        VButton,
        StatusWidget,
        ModalContentNewFolder,
        ModalContentNewTask,
    },
    data() {
        return {
            radio: 1,
            radio2: 1,
            isModalVisible: false,
            isModalVisible2: false,
            isFolderOpen: false,
            items: [
                {
                    id: 1,
                    parentId: null,
                    name: 'All',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 34341,
                    parentId: null,
                    name: 'All',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 2,
                    parentId: 1,
                    name: 'Customer',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 3,
                    parentId: 1,
                    name: 'Consumer',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 4,
                    parentId: 2,
                    name: 'East',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 5,
                    parentId: 2,
                    name: 'West',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 6,
                    parentId: 3,
                    name: 'East',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 7,
                    parentId: 3,
                    name: 'West',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 2828,
                    parentId: 4,
                    name: 'Amet',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 2929,
                    parentId: 4,
                    name: 'Memet',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 2494,
                    parentId: 5,
                    name: 'Artur',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 2985,
                    parentId: 5,
                    name: 'Hamid',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 5228,
                    parentId: 6,
                    name: 'Ibraim',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 5078,
                    parentId: 6,
                    name: 'Rustam',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 5818,
                    parentId: 7,
                    name: 'Ayder',
                    type: 'folder',
                    isOpen: false,
                },
                {
                    id: 5857,
                    parentId: 7,
                    name: 'Samit',
                    type: 'folder',
                    isOpen: false,
                },
            ],
        }
    },
    computed: {
        mapped() {
            const mapped = {},
                roots = []
            for (const item of this.items) {
                mapped[item.id] = item
                mapped[item.id]['childrens'] = []
            }
            for (const key in mapped) {
                const item = mapped[key]
                if (item['parentId']) {
                    mapped[item['parentId']]['childrens'].push(item)
                } else {
                    roots.push(item)
                }
            }
            return roots
        },
    },
    methods: {
        showModal() {
            this.isModalVisible = true
        },
        closeModal() {
            this.isModalVisible = false
        },
    },
}
</script>
