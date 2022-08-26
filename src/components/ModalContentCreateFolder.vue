<template>
    <VDialog modal position="top" header="Создать папку" :visible="visible" @show="getData" @update:visible="close">
        <div class="v-modal-content-create-folder">
            <VTextField
                class="modal-content-mew-folder__name"
                autocomplete="off"
                v-model="data.name"
                label="Название папки"
                placeholder="Название папки"
            />

            <VFolderSelect label="Родительская папки" v-model="data.parentFolder" :folders="folders" />

            <div class="v-modal-content-create-folder__access">
                <p class="v-modal-content-create-folder__access-label">Доступ</p>
                <div class="v-modal-content-create-folder__access-options">
                    <VRadio v-model="data.access" :value="accessValue.public" name="access"> Публичный </VRadio>
                    <VRadio v-model="data.access" :value="accessValue.private" name="access"> Определенные пользователи или группы </VRadio>
                </div>
            </div>

            <div v-if="data.access === accessValue.private" class="v-text-field modal-content-mew-folder__name">
                <VUserSelect multiple label="Пользователи" v-model="data.participants" :users="users" />
            </div>
        </div>
        <template #footer>
            <div class="v-modal-content-create-folder__actions">
                <VBtn label="Сохранить" @click="createFolder" class="p-button-text" />
                <VBtn label="Отмена" @click="close" />
            </div>
        </template>
    </VDialog>
</template>

<script setup>
import { UserService } from '../services/UserService'
import { FolderService } from '../services/FolderService'
import VUserSelect from './VUserSelect'
import VFolderSelect from './VFolderSelect'
import VDialog from './base/VDialog/VDialog'
import VBtn from './base/VBtn/VBtn'
import VRadio from './base/VRadio/VRadio'
import VTextField from './base/VTextField/VTextField'
import { reactive, ref, watch } from 'vue'

defineProps({
    visible: Boolean,
})

const emit = defineEmits(['update:visible'])

const accessValue = {
    public: 'pubic',
    private: 'private',
}

const data = reactive({
    name: '',
    parentFolder: null,
    participants: [],
    access: accessValue.public,
})

watch(
    () => data.access,
    (value) => {
        if (value === accessValue.public) {
            data.participants = []
        }
    }
)

const users = ref([])
const folders = ref([])

async function createFolder() {
    const createFolderPayload = {
        name: data.name,
        access: data.access,
        parentFolder: data.parentFolder.id,
        participants: data.participants.map((item) => item.id),
    }
    console.log(createFolderPayload)

    // await FolderService.create(createFolderPayload)
}

function close() {
    emit('update:visible', false)
}

async function getData() {
    getUsers()
    getFolders()
}

async function getUsers() {
    const response = await UserService.getAllUsersWithoutAuthUser()
    users.value = response.data.users
}

async function getFolders() {
    const response = await FolderService.getAllFoldersForAuthUser()
    folders.value = response.data.folders
}
</script>

<style>
.v-modal-content-create-folder {
    display: grid;
    gap: 1rem;

    padding: 0.5rem 0;
}

.v-modal-content-create-folder__actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.v-modal-content-create-folder__access {
    display: grid;
    gap: 1rem;
}

.v-modal-content-create-folder__access-options {
    display: grid;
    gap: 0.5rem;
}
</style>
