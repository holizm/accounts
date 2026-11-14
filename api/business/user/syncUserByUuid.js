
import {
    clientError,
    create,
    dbItem,
    dbUpdateItem,
    providers,
} from 'core'
import runUserSyncAugmenters from './runUserSyncAugmenters.js'

export const syncUserByUuid = async params => {
    const identity = params.identity || providers.identity
    const uuid = params?.body?.uuid || identity?.uuid
    if (!uuid) {
        clientError('userIdentityFetchFailed')
    }
    const lookup = {
        acrossLocales: true,
        part: 'accounts',
        query: {
            tenant: providers.tenant,
            uuid,
        },
        type: 'user',
    }
    let user = await dbItem(lookup)
    if (!user) {
        try {
            user = await create({
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
        catch (e) {
            if (e.code !== 11000) throw e
            user = await dbItem(lookup)
            if (!user) throw e
        }
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
    await runUserSyncAugmenters(user)
    return user
}
