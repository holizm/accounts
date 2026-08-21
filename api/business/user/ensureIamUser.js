import { clientError } from 'core'
import {
    iamGet,
    iamPost,
} from '../iam.js'

export default async params => {
    const { item } = params
    if (item.uuid) {
        return item.uuid
    }
    const username = item.username || item.userName
    if (!username) {
        clientError('userNameIsRequired')
    }
    let users = await iamGet(`users?username=${encodeURIComponent(username)}&exact=true`, params)
    if (!users?.length) {
        await iamPost('users', {
            email: item.email || params.email || params.body?.email,
            enabled: true,
            firstName: item.firstName || params.firstName || params.body?.firstName,
            lastName: item.lastName || params.lastName || params.body?.lastName,
            username,
        }, params)
        users = await iamGet(`users?username=${encodeURIComponent(username)}&exact=true`, params)
    }
    if (!users?.length) {
        clientError('iamUserCreationFailed')
    }
    item.uuid = users[0].id
    item.username = username
    return item.uuid
}
