<template>
    <div class="modal-content-mew-folder">
        <VTextField class="modal-content-mew-folder__name" v-model="folderName" label="Название папки" placeholder="Название папки" />
        <div class="modal-content-mew-folder__location">
            <LocationPicker />
        </div>
        <div class="modal-content-mew-folder__access">
            <p class="modal-content-mew-folder__access-label">Доступ</p>
            <div class="modal-content-mew-folder__access-options">
                <VRadio v-model="access" value="private" name="access"> Личный </VRadio>
                <VRadio v-model="access" value="team" name="access"> Доступно моей команде </VRadio>
                <VRadio v-model="access" value="users" name="access"> Определенные пользователи или группы </VRadio>
            </div>
            <ContactPicker v-if="access === 'users'" />
        </div>
    </div>
</template>

<script>
import VTextField from './base/VTextField/VTextField'
import VRadio from './base/VRadio/VRadio'
import LocationPicker from './LocationPicker'
import ContactPicker from './ContactPicker'

export default {
    components: {
        VTextField,
        LocationPicker,
        ContactPicker,
        VRadio,
    },

    data() {
        return {
            access: 'private',
            folderName: '',
        }
    },
}
</script>

<style>
.modal-content-mew-folder__title {
    padding-bottom: 1rem;
}

.modal-content-mew-folder__name {
    margin-bottom: 1rem;
}

.modal-content-mew-folder__location {
    margin-bottom: 1rem;
}

.modal-content-mew-folder__access {
    display: grid;
    gap: 1rem;
}

.modal-content-mew-folder__access-options {
    display: grid;
    gap: 0.5rem;
}
</style>
