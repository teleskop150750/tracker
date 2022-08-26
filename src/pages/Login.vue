<template>
    <VFormCard>
        <VForm @submit="login">
            <template #header>
                <VTitle>Войти</VTitle>
            </template>

            <VTextField class="v-form__field" label="Email" name="lastName" placeholder="email" v-model.trim="user.email" />
            <VTextField class="v-form__field" label="Password" name="password" placeholder="password" v-model.trim="user.password" />

            <template #footer>
                <div class="v-form-actions">
                    <VBtn type="submit" label="Войти" />
                    <VBtn flat :to="{ name: 'register' }" label="Зарегистрироваться" />
                </div>
            </template>
        </VForm>
    </VFormCard>
</template>

<script>
import VForm from '../components/base/VForm/VForm'
import VTextField from '../components/base/VTextField/VTextField'
import VFormCard from '../components/base/VFormCard/VFormCard'
import VBtn from '../components/base/VBtn/VBtn'
import VTitle from '../components/base/VTitle/VTitle'
import { UserService } from '../services/UserService'

export default {
    components: {
        VForm,
        VTextField,
        VBtn,
        VFormCard,
        VTitle,
    },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
        }
    },
    methods: {
        async login() {
            try {
                if (this.user.login === '' || this.user.password === '') {
                    return
                }

                const response = await UserService.login(this.user)
                console.log(response.data)
                await this.$store.commit('auth/SET_USER', {
                    ...response.data,
                })
                this.$router.push({ name: 'home' })
            } catch (error) {
                console.error(error)
            }
        },
    },
}
</script>
