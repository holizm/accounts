import { iamGet } from '../iam.js'
import syncUserByUuid from './syncUserByUuid.js'

export default async params => {
    const users = await iamGet('users', params)
    return await Promise.all(users.map(user => syncUserByUuid({
        ...params,
        identity: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.username,
            uuid: user.id,
        },
    })))
}
