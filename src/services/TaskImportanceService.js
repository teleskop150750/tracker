import { AbstractService } from './AbstractService'
import { apiClient } from './API'

export class TaskImportanceService extends AbstractService {
    static getAll(payload) {
        return apiClient.post('api?cmd=get-all-task-importance', AbstractService.buildPayload(payload))
    }
}
