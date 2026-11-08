import {
    clientError,
    providers,
} from 'core'
import { syncUserByUuid } from 'accountsBusiness'
const syncByUuidOnPost = async params => {
    const identity = providers.identity
    if (!providers.user || identity?.uuid !== providers.user) clientError('forbidden')
    const administrator = identity.roles?.some(role => ['admin', 'control', 'superAdmin'].includes(role))
    const selected = administrator ? params : {
        defaultPersonType: params.defaultPersonType || params.query?.defaultPersonType,
        displayName: identity.name || identity.userName,
        host: params.host,
        identity,
        uuid: providers.user
    }
    const user = await syncUserByUuid(selected)
    return user
}
export default {
    syncByUuidOnPost,
    syncOnPost: syncByUuidOnPost
}
