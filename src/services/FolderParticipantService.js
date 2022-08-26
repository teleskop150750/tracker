import { AbstractService } from './AbstractService'
import { apiClient } from './API'

export class FolderParticipantService extends AbstractService {
    static create(payload) {
        return apiClient.post('api?cmd=create-folder-participant', AbstractService.buildPayload(payload))
    }
}
