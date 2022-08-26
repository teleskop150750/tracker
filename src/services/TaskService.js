import { AbstractService } from './AbstractService'
import { apiClient } from './API'

export class TaskService extends AbstractService {
    static create(payload) {
        return apiClient.post('api?cmd=create-task', AbstractService.buildPayload(payload))
    }
}
