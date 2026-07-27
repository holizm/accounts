
import {
    createOnPost,
    getByFilter,
    getOrCreateAndGet
} from 'core'
import { iamGet } from '../iam.js'

export default async params => {
    const {
        uuid,
        username,
    } = params?.body
    // const user = await iamGet(`users/${userUuid}`) todo
    const user = await getOrCreateAndGet(
        {
            part: 'accounts',
            type: 'user',
            query: {
                uuid: uuid
            }
        },
        {
            uuid: uuid,
            username: username
        }
    )
    return user

}

