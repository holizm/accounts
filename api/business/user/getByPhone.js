import { createOnPost } from 'core'
import { getUserByUsername } from './getByUsername.js'

export const getUserByPhone = async phone => {
    let user = await getUserByUsername(phone)
    if (!user) {
        await createOnPost({
            lastSyncDate: new Date(),
            part: 'accounts',
            type: 'user',
            username: phone,
        })
    }
    user = await getUserByUsername(phone)
    return user
}
