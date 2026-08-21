
import {
    clientError,
    createOnPost,
    dbItem,
    dbUpdateItem,
    providers,
} from 'core'

export default async params => {
    const identity = params.identity || providers.identity
    const uuid = params?.body?.uuid || identity?.uuid
    if (!uuid) {
        clientError('userIdentityFetchFailed')
    }
    let user = await dbItem({
        part: 'accounts',
        query: { uuid },
        type: 'user',
    })
    if (!user) {
        user = await createOnPost({
            ...identity,
            ...params,
            defaultPersonType: params.defaultPersonType || params.query?.defaultPersonType,
            lastSyncDate: new Date(),
            part: 'accounts',
            type: 'user',
            username: identity?.userName,
            uuid,
        })
    }
    else {
        user.lastSyncDate = new Date()
        user.username = identity?.userName || user.username
        user = await dbUpdateItem({
            item: user,
            part: 'accounts',
            type: 'user',
        })
    }
    return user
}
