import {
    deriveKey,
    getOrCreateAndGet,
} from "Core"

export const getKey = async user => {
    const value = deriveKey(user)
    const key = await getOrCreateAndGet({
        part: "Accounts",
        type: "Key",
        query: {
            user
        },
    }, {
        user,
        value,
    })
    return key
}
