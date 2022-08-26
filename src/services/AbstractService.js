import store from '../store'

export class AbstractService {
    static buildPayload = (payload = {}) => {
        const user = store.getters['auth/user']
        
        if (!user) {
            return payload
        }

        payload.authUserId = user.id

        return payload
    }
}
