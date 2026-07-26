import { Mutex } from 'async-mutex'
import {
    createOnPost,
    getByFilter
} from 'core'

export default async params => {
    const { userUuid } = params?.body

    if (!user) {

    }
    return user
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

export const getOrCreateUser = async (uuid, defaultPersonType) => {
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

            await createOnPost({
                type: 'contacts',
                part: 'naturalPerson'
            })


            return user;
        }
    })
}
