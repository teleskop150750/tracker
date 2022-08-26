<script>
import { UserService } from '../services/UserService'
import VForm from '../components/base/VForm/VForm'
import VTextField from '../components/base/VTextField/VTextField'
import VFormCard from '../components/base/VFormCard/VFormCard'
import VBtn from '../components/base/VBtn/VBtn'
import VTitle from '../components/base/VTitle/VTitle'

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
                lastName: '',
                firstName: '',
                middleName: '',
                post: '',
                department: '',
                phone: '',
                password: '',
            },
        }
    },
    methods: {
        async register() {
            try {
                if (this.user.login === '' || this.user.password === '') {
                    return
                }
                await UserService.register(this.user)
                this.$router.push({ name: 'login' })
            } catch (error) {
                console.error(error)
            }
        },
    },
}
</script>

<template>
    <VFormCard>
        <VForm @submit="register">
            <template #header>
                <VTitle>Регистрация</VTitle>
            </template>

            <VTextField class="v-form__field" label="Email" name="lastName" placeholder="email" v-model.trim="user.email" />
            <VTextField class="v-form__field" label="Фамилия" name="lastName" placeholder="Фамилия" v-model.trim="user.lastName" />
            <VTextField class="v-form__field" label="Имя" name="firstName" placeholder="Имя" v-model.trim="user.firstName" />
            <VTextField class="v-form__field" label="Отчество" name="middleName" placeholder="Отчество" v-model.trim="user.middleName" />
            <VTextField class="v-form__field" label="Должность" name="post" placeholder="Должность" v-model.trim="user.post" />
            <VTextField class="v-form__field" label="Отдел" name="department" placeholder="Отдел" v-model.trim="user.department" />
            <VTextField class="v-form__field" label="Телефон" name="phone" placeholder="Телефон" v-model.trim="user.phone" />
            <VTextField class="v-form__field" label="Password" name="password" placeholder="password" v-model.trim="user.password" />

            <template #footer>
                <div class="v-form-actions">
                    <VBtn type="submit" label="Зарегистрироваться" />
                    <VBtn flat :to="{ name: 'login' }" label="Войти" />
                </div>
            </template>
        </VForm>
    </VFormCard>
</template>
