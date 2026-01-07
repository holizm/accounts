import {
    deriveKey,
    getOrCreateAndGet,
} from 'core'

export const getKey = async user => {
    const value = deriveKey(user)
    const key = await getOrCreateAndGet({
        part: 'accounts',
        type: 'key',
        query: {
            user
        },
    }, {
        user,
        value,
    })
    return key
}
