<template>
    <div class="page">
        <VBtn label="Show" @click="openBasic" />
        <VDialog position="top-right" header="Header" v-model:visible="displayBasic" clickOutside :style="{ width: '50vw' }">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <template #footer>
                <VBtn label="No" @click="closeBasic" class="p-button-text" />
                <VBtn label="Yes" @click="closeBasic" />
            </template>
        </VDialog>
        <!-- <VContainer>VContainer
            <VTitle class="page__title">Файловый менеджер</VTitle>
            <div class="file-manager">
                <div class="file-manager__table">
                    <VTable :headers="table.headers" :items="table.items">
                        <template #item-actions="{ item }">
                            <VTd>
                                <div class="item-actions">
                                    <VButton @click="downloadFile(item.id, item.name)" label="Скачать" />
                                    <VButton @click="deleteFile(item.id)" label="Удалить" />
                                </div>
                            </VTd>
                        </template>
                    </VTable>
                </div>
                <div class="file-manager__form">
                    <VFormCard>
                        <VForm @submit="uploadFile($event)">
                            <template #header>
                                <VTitle level="2">Добавить файл</VTitle>
                            </template>

                            <VTextField class="v-form__field" label="File" name="file" type="file" />

                            <template #footer>
                                <VButton block label="Загрузить" type="submit" />
                            </template>
                        </VForm>
                    </VFormCard>
                </div>
            </div>
        </VContainer> -->
    </div>
</template>

<script setup>
import VBtn from '../components/base/VBtn/VBtn'
import VDialog from '../components/base/VDialog/VDialog'
import { ref } from 'vue'

const isOpenCreateFolderModal = ref(true)

const displayBasic = ref(false)

const openBasic = () => {
    displayBasic.value = true
}

const closeBasic = () => {
    displayBasic.value = false
}
// import VContainer from '../components/layouts/default/VContainer'
// import VTitle from '../components/base/VTitle/VTitle'
// import VTd from '../components/base/VTable/VTd'
// import VTable from '../components/base/VTable/VTable'
// import VButton from '../components/base/VButton/VButton'
// import VFormCard from '../components/base/VFormCard/VFormCard'
// import VForm from '../components/base/VForm/VForm'
// import VTextField from '../components/base/VTextField/VTextField'
// // import FileService from "../services/FileService";

// export default {
//     components: {
//         VContainer,
//         VTitle,
//         VTable,
//         VTd,
//         VButton,
//         VFormCard,
//         VForm,
//         VTextField,
//     },
//     data() {
//         return {
//             user: {
//                 login: '',
//                 password: '',
//             },
//             table: {
//                 headers: [
//                     {
//                         text: 'Название',
//                         value: 'name',
//                     },
//                     {
//                         text: 'Дата',
//                         value: 'created_at',
//                     },
//                     {
//                         text: 'Действия',
//                         value: 'actions',
//                     },
//                 ],
//                 items: [],
//             },
//         }
//     },
//     async mounted() {
//         this.getFiles()
//     },
//     methods: {
//         async getFiles() {
//             // const user = this.$store.getters["auth/user"];
//             // const response = await FileService.all({
//             // login: user.login,
//             //   password: user.password,
//             // });
//             // this.table.items = response.data.files;
//         },
//         async uploadFile() {},
//         async downloadFile() {},
//         async deleteFile() {},
//     },
// }
</script>

<style>
.file-manager {
    display: grid;
    grid-template-columns: 50rem 20rem;
    gap: 2rem;
}

.page__title {
    margin-bottom: 30px;
}

.item-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}
</style>
