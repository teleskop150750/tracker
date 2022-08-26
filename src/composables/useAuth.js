import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import UserService from '../services/UserService'

const user = ref(null)
const login = ref(null)
const password = ref(null)
const isAuth = computed(() => user.value !== null)

export const useAuth = () => {
    const router = useRouter()
    return {
        user: () => {
            return user
        },

        login: async (payload) => {
            try {
                const { data } = await UserService.login(payload)
                user.value = data.user
                login.value = payload.login
                password.value = payload.password
                router.push('/files')

                return user
            } catch (e) {
                return Promise.reject(e.errors)
            }
        },

        register: async (payload) => {
            try {
                const { data } = await UserService.register(payload)
                user.value = data.user
                login.value = payload.login
                password.value = payload.password
                router.push('/files')

                return user
            } catch (e) {
                return Promise.reject(e.errors)
            }
        },

        logout: () => {
            user.value = null
        },

        check: () => {
            return isAuth
        },

        setLogin: (payload) => {
            login.value = payload
        },

        getLogin: () => {
            return login
        },

        setPassword: (payload) => {
            password.value = payload
        },

        getPassword: () => {
            return password
        },
    }
}
