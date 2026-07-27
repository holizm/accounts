
import {
    createOnPost,
    getByFilter,
    getOrCreateAndGet
} from 'core'
import { iamGet } from '../iam.js'

export default async params => {
    const { uuid } = params?.body
    // const user = await iamGet(`users/${uuid}`) todo get
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
        }
    )
    return user

}

