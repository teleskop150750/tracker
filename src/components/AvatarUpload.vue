<template>
    <div class="avatar-upload">
        <div class="avatar-upload__img-wrapper">
            <img class="avatar-upload__img" v-if="authUser.avatar" :src="authUser.avatar" alt="аватарка" />
            <img class="avatar-upload__img" v-else :src="require('@/assets/images/avatar.webp')" alt="аватарка" />
        </div>
        <div class="avatar-upload__avatar-icon-wrapper">
            <ProfileHeaderAvatarIcon />
        </div>
        <label class="avatar-upload__label" for="avatar" aria-label="изменить аватар"></label>
        <input class="avatar-upload__input" id="avatar" name="avatar" type="file" accept="image/*" tabindex="-1" @change="uploadAvatar" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FileService from '@/services/FileService'
import { getErrorData } from '@/utils/helpers'
import ProfileHeaderAvatarIcon from '@/components/RrofilePage/ProfileHeaderAvatarIcon.vue'
export default {
    name: 'ProfileHeaderAvatar',
    components: {
        ProfileHeaderAvatarIcon,
    },
    emits: {
        update: null,
    },
    data() {
        return {
            endpoint: '/users/auth/avatar',
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        fullName() {
            return this.authUser.name + ' ' + this.authUser.lastname
        },
    },
    methods: {
        async uploadAvatar(event) {
            const file = event.target.files[0]
            const payload = {}
            const formData = new FormData()
            formData.append('avatar', file)
            payload.file = formData
            payload.endpoint = this.endpoint
            try {
                this.file = null
                await FileService.uploadFile(payload)
                this.$emit('update')
                this.$store.dispatch('auth/getAuthUser')
            } catch (error) {
                this.error = getErrorData(error)
            }
        },
    },
}
</script>

<style>
.avatar-upload {
    grid-row: 1 / 3;

    position: relative;

    border-radius: 100%;

    overflow: hidden;

    user-select: none;
}

.avatar-upload * {
    user-select: none;
}

.avatar-upload__img-wrapper {
    position: relative;

    padding-bottom: 100%;
}

.avatar-upload__img {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;
}

.avatar-upload__avatar-icon-wrapper {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;

    background-color: hsl(0deg 0% 0% / 50%);

    opacity: 0;

    pointer-events: none;

    transition: opacity 0.3s;
}

.avatar-upload:hover .avatar-upload__avatar-icon-wrapper {
    opacity: 1;
}

.avatar-upload__label {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;

    width: 100%;
    height: 100%;

    cursor: pointer;

    opacity: 0;
}

.avatar-upload__input {
    display: none;
}
</style>
