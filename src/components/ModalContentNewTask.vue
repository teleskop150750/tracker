<template>
    <div class="modal-content-mew-task">
        <VTextField class="modal-content-mew-task__name" v-model="taskName" label="Название задачи" placeholder="Название задачи" />
        <div class="modal-content-mew-task__location">
            <LocationPicker />
        </div>
        <div class="modal-content-mew-task__status-bar">
            <StatusWidget />
            <ContactPicker />
        </div>
        <div class="modal-content-mew-task__date-bar">
            <TaskDateBar />
        </div>
        <div class="modal-content-mew-task__description">
            <quill-editor ref="quill" />
        </div>
    </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import TaskDateBar from './task/TaskDateBar'
import VTextField from './base/VTextField/VTextField'
import StatusWidget from './StatusWidget/StatusWidget'
import LocationPicker from './LocationPicker'
import ContactPicker from './ContactPicker'

export default {
    components: {
        VTextField,
        LocationPicker,
        ContactPicker,
        StatusWidget,
        TaskDateBar,
        QuillEditor,
    },

    data() {
        return {
            access: 'private',
            taskName: '',
            description: '',
        }
    },
    methods: {
        getDescription() {
            this.description = this.$refs['quill'].getHTML()
        },
    },
}
</script>

<style>
.modal-content-mew-task__title {
    padding-bottom: 1rem;
}

.modal-content-mew-task__name {
    margin-bottom: 1rem;
}

.modal-content-mew-task__location {
    margin-bottom: 1rem;
}

.modal-content-mew-task__status-bar {
    display: flex;
    gap: 1rem;
    align-items: center;

    margin: 0 -1rem;
}

.modal-content-mew-task__description {
    margin: 0 -1rem;
}
</style>
