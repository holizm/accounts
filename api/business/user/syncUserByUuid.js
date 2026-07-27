import { Mutex } from 'async-mutex'
import {
    createOnPost,
    getByFilter
} from 'core'

export default async params => {
    const { userUuid } = params?.body
    const user = await getOrCreateUser(userUuid)
}

const locks = new Map()

const getLock = key => {
    let mutex = locks.get(key)
    if (!mutex) {
        mutex = new Mutex()
        locks.set(key, mutex)
    }
    return mutex
}

export const getOrCreateUser = async (uuid) => {
    const mutex = getLock(uuid)
    return mutex.runExclusive(async () => {
        let user = await getByFilter(
            {
                type: 'user',
                part: 'accounts'
            },
            {
                uuid: uuid
            }
        )
        if (!user) {
            let person = await createOnPost({
                part: 'contacts',
                type: 'person',
            })
            const { inherited, ...personData } = person;
            const userModel = {
                uuid: uuid,
                userName: '',
                contact: inherited,
                person: personData
            }
            const user = await createOnPost({
                part: 'accounts',
                type: 'user',
                ...userModel
            })
            return user
        }
    })
}
