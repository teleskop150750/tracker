<template>
    <div v-if="user" class="v-header-user-dropdown">
        <VPopper offset-distance="18px" placement="bottom-end">
            <VAvatar>A</VAvatar>
            <template #content>
                <div class="v-header-user-dropdown__content">
                    <div class="v-header-user-dropdown__content-user">
                        <VAvatar :size="46" class="v-header-user-dropdown__content-user-avatar">A</VAvatar>
                        <p class="v-header-user-dropdown__content-user-name">
                            {{ user.lastName + ' ' + user.firstName }}
                        </p>
                    </div>
                    <div class="v-header-user-dropdown__content-body">
                        <VBtn label="Выйти" @click="logout" />
                    </div>
                </div>
            </template>
        </VPopper>
    </div>
</template>

<script setup>
import VBtn from '../../../base/VBtn/VBtn.vue'
import VAvatar from '../../../base/VAvatar/VAvatar.vue'
import VPopper from '../../../base/VPopper/VPopper.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters['auth/user'])

async function logout() {
    await store.commit('auth/DELETE_USER')
    router.push({ name: 'login' })
}
</script>

<style>
.v-header-user-dropdown .v-popper__trigger {
    cursor: pointer;
}

.v-header-user-dropdown__content {
    display: grid;
    grid-template-columns: 1fr;

    width: 18rem;
    padding: 1rem;
}

.v-header-user-dropdown__content-user {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: 1rem;
    align-items: center;

    margin-bottom: 1rem;
}
</style>
