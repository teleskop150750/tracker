export default function auth({ next, store }) {
    const loginQuery = { name: 'login' }

    if (!store.getters['auth/check']) {
        store.commit('auth/INIT')

        if (!store.getters['auth/check']) {
            next(loginQuery)
        } else {
            next()
        }
    } else {
        next()
    }
}
