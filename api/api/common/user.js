import { syncUserByUuid } from 'accountsBusiness'

const syncByUuidOnPost = async params => {
    const user = await syncUserByUuid(params)
    return user
}

const syncOnPost = async params => await syncUserByUuid(params)

export default {
    syncByUuidOnPost,
    syncOnPost,
}
