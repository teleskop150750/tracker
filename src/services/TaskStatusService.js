import { AbstractService } from './AbstractService'
import { apiClient } from './API'

export class TaskStatusService extends AbstractService {
    static getAll(payload) {
        return apiClient.post('api?cmd=get-all-task-statuses', AbstractService.buildPayload(payload))
    }
}
