import { create } from 'core'
import { getUserByUsername } from './getByUsername.js'

export const getUserByPhone = async phone => {
    let user = await getUserByUsername(phone)
    if (!user) {
        await create({
            lastSyncDate: new Date(),
            part: 'accounts',
            phone,
            type: 'user',
            username: phone,
        })
    }
    user = await getUserByUsername(phone)
    return user
}
