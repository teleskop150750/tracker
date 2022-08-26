<template>
    <VDialog modal position="top" header="Добавить задачу" :visible="visible" @show="getData" @update:visible="close">
        <div class="v-modal-content-create-task">
            <VTextField
                class="modal-content-mew-folder__name"
                v-model="data.name"
                autocomplete="off"
                label="Название задачи"
                placeholder="Название задачи"
            />

            <VFolderSelect multiple label="Местоположение" v-model="data.folders" :folders="folders" />

            <VUserSelect multiple label="Исполнители" v-model="data.executors" :users="users" />

            <div class="v-modal-content-create-task__bar">
                <VDatePicker label="Дата начала" class="modal-content-mew-task__name" v-model="data.dateStart" />
                <VDatePicker label="Дата конца" class="modal-content-mew-task__name" v-model="data.dateEnd" />
                <VTaskStatusSelect label="Статус" class="modal-content-mew-task__name" :statuses="taskStatuses" v-model="data.status" />
                <VTaskImportanceSelect
                    label="Важность"
                    class="modal-content-mew-task__name"
                    :importanceList="taskImportanceList"
                    v-model="data.importance"
                />
            </div>

            <div class="v-modal-content-mew-task__description">
                <quill-editor ref="quillRef" />
            </div>
        </div>
        <template #footer>
            <div class="v-modal-content-create-task__actions">
                <VBtn label="Сохранить" @click="createFolder" class="p-button-text" />
                <VBtn label="Отмена" @click="close" />
            </div>
        </template>
    </VDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { UserService } from '../services/UserService'
import { FolderService } from '../services/FolderService'
import { TaskStatusService } from '../services/TaskStatusService'
import { TaskImportanceService } from '../services/TaskImportanceService'
import VTaskImportanceSelect from './VTaskImportanceSelect'
import VTaskStatusSelect from './VTaskStatusSelect'
import VUserSelect from './VUserSelect'
import VFolderSelect from './VFolderSelect'
import VDatePicker from './base/VDatePicker/VDatePicker'
import VDialog from './base/VDialog/VDialog'
import VBtn from './base/VBtn/VBtn'
import VTextField from './base/VTextField/VTextField'

defineProps({
    visible: Boolean,
})

const emit = defineEmits(['update:visible'])

const quillRef = ref(null)

const today = new Date()
const dd = String(today.getDate()).padStart(2, '0')
const mm = String(today.getMonth() + 1).padStart(2, '0')
const yyyy = today.getFullYear()

const data = reactive({
    name: '',
    folders: [],
    executors: [],
    dateStart: `${yyyy}/${mm}/${dd}`,
    dateEnd: `${yyyy}/${mm}/${dd}`,
    status: null,
    importance: null,
})

const users = ref([])
const folders = ref([])
const taskStatuses = ref([])
const taskImportanceList = ref([])

async function createFolder() {
    if (!data.status || !data.importance || !data.name) return

    const createTaskPayload = {
        name: data.name,
        folders: data.folders.map((item) => item.id),
        executors: data.executors.map((item) => item.id),
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        status: data.status.id,
        importance: data.importance.id,
        description: getDescriptionTask(),
    }

    await FolderService.create(createTaskPayload)
}

function getDescriptionTask() {
    return quillRef.value.getHTML()
}

function close() {
    emit('update:visible', false)
}

async function getData() {
    getUsers()
    getFolders()
    getTaskStatuses()
    getTaskImportance()
}

async function getUsers() {
    const response = await UserService.getAllUsersWithoutAuthUser()
    users.value = response.data.users
}

async function getFolders() {
    const response = await FolderService.getAllFoldersForAuthUser()
    folders.value = [...response.data.folders]
}

async function getTaskStatuses() {
    const response = await TaskStatusService.getAll()
    taskStatuses.value = response.data.taskStatuses
}

async function getTaskImportance() {
    const response = await TaskImportanceService.getAll()
    taskImportanceList.value = response.data.taskImportanceList
}
</script>

<style>
.v-modal-content-create-task {
    display: grid;
    gap: 1rem;

    padding: 0.5rem 0;
}

.v-modal-content-create-task__actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.v-modal-content-create-task__bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    align-items: center;
}

.v-modal-content-mew-task__description {
    height: calc(42px + 250px);
    display: grid;
    grid-template-rows: min-content 1fr;
}

.v-modal-content-mew-task__description .ql-toolbar {
    height: 42px;
    overflow: auto;
}

.v-modal-content-mew-task__description .ql-container {
    height: 250px;
    overflow: auto;
}
</style>
