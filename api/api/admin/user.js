import {
    createOnPost,
    dbItem,
    read,
    write,
} from 'core'
import {
    assignRoles,
    changePassword,
    getRoles,
    syncUsers,
} from 'accountsBusiness'

const assignedRolesOnGet = async params => await getRoles(params)

const assignRolesOnPost = async params => await assignRoles(params)

const changePasswordOnPost = async params => await changePassword({
    ...params,
    password: params.body?.password,
    user: params.query?.uuid,
})

const createForPersonOnPost = async params => {
    const personId = params.body?.person || params.body?.personUuid
    const person = await dbItem({
        id: personId,
        part: 'contacts',
        type: 'person',
    })
    const contact = await dbItem({
        id: person?.contact,
        part: 'contacts',
        type: 'contact',
    })
    return await createOnPost({
        ...params,
        body: {
            ...params.body,
            contact,
            person,
            username: params.body?.username || params.body?.userName,
        },
        part: 'accounts',
        type: 'user',
    })
}

const rolesOnGet = async params => await getRoles({
    ...params,
    query: {},
})

export default {
    ...read,
    ...write,
    assignedRolesOnGet,
    assignRolesOnPost,
    changePasswordOnPost,
    createForPersonOnPost,
    rolesOnGet,
    syncAllOnPost: syncUsers,
}
