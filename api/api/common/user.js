import syncUserByUuid from '../../business/user/syncUserByUuid.js'

const syncByUuidOnPost = async params => {
    const user = await syncUserByUuid(params)
    return user
}

export default {
    syncByUuidOnPost,
}
