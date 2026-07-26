import syncUserByUuid from '../../business/user/syncUserByUuid.js'

const syncByUuidOnPost = async params => {
    await syncUserByUuid(params)
    return ""
}

export default {
    syncByUuidOnPost,
}
