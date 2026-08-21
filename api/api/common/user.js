import syncUserByUuid from '../../business/user/syncUserByUuid.js'

const syncByUuidOnPost = async params => {
    const user = await syncUserByUuid(params)
    return user
}

const syncOnPost = async params => await syncUserByUuid(params)

export default {
    syncByUuidOnPost,
    syncOnPost,
}
