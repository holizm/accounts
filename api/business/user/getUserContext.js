import { ensure } from 'core'
import { getUser } from './getUser.js'

export const getUserContext = async requestedUserUuid => {
    const user = await getUser(requestedUserUuid)
    const personId = user?.person?.id || user?.person
    ensure(personId).isSomething('userPersonNotFound')
    const contactId = user?.contact?.id ||
        user?.contact ||
        user?.person?.contact?.id ||
        user?.person?.contact
    const userContext = {
        contactId,
        personId,
        user,
    }
    return userContext
}
