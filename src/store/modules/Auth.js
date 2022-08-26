const state = () => ({
    user: null,
})

const getters = {
    user: (state) => {
        return state.user
    },

    check: (state) => {
        return !!state.user
    },
}

const actions = {}

const mutations = {
    INIT(state) {
        let user = window.localStorage.getItem('user') ?? null
        
        if (user) {
            user = JSON.parse(user)
        }
        
        state.user = user
    },
    SET_USER(state, user) {
        state.user = user
        window.localStorage.setItem('user', JSON.stringify(user)) ?? null
    },
    DELETE_USER(state) {
        window.localStorage.removeItem('user')
        state.user = null
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
