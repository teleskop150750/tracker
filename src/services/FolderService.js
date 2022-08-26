import { AbstractService } from './AbstractService'
import { apiClient } from './API'

export class FolderService extends AbstractService {
    static create(payload) {
        return apiClient.post('api?cmd=create-folder', AbstractService.buildPayload(payload))
    }
    static getAllFoldersForAuthUser(payload) {
        return apiClient.post('api?cmd=get-all-folders-list-for-auth-user', AbstractService.buildPayload(payload))
    }
}
