import {
    clientError,
    dbItem,
} from 'core'
import {
    iamDelete,
    iamGet,
    iamPost,
} from '../iam.js'

export const assignRoles = async params => {
    const id = params.query?.id
    const user = await dbItem({
        id,
        part: 'accounts',
        type: 'user',
    })
    if (!user?.uuid) {
        clientError('userIdentityFetchFailed')
    }
    const selectedNames = new Set(params.body?.roles || [])
    const allRoles = (await iamGet('roles', params))
        .filter(role => !/[-_]/.test(role.name))
    const assignedRoles = await iamGet(`users/${user.uuid}/role-mappings/realm`, params)
    const assignedNames = new Set(assignedRoles.map(role => role.name))
    const rolesToAdd = allRoles.filter(role =>
        selectedNames.has(role.name) && !assignedNames.has(role.name)
    )
    const rolesToDelete = assignedRoles.filter(role =>
        !selectedNames.has(role.name) && !/[-_]/.test(role.name)
    )
    if (rolesToAdd.length > 0) {
        await iamPost(`users/${user.uuid}/role-mappings/realm`, rolesToAdd, params)
    }
    if (rolesToDelete.length > 0) {
        await iamDelete(`users/${user.uuid}/role-mappings/realm`, rolesToDelete, params)
    }
    return await iamGet(`users/${user.uuid}/role-mappings/realm`, params)
}
