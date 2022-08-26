import { AbstractService } from './AbstractService'
import { apiClient } from './API'

export class UserService extends AbstractService {
    static register(payload) {
        return apiClient.post('api?cmd=register', payload)
    }
    static login(payload) {
        return apiClient.post('api?cmd=login', payload)
    }
    static getAllUsersWithoutAuthUser() {
        return apiClient.post('api?cmd=get-all-users-without-auth-user', AbstractService.buildPayload())
    }
}
