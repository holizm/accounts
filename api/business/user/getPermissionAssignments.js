import {
    clientError,
    dbItem,
    dbItems,
    parseId,
    providers,
} from 'core'
import { iamGet } from '../iam.js'
import { getPermissionAccess } from './getPermissionAccess.js'
import rules from './permissionManagementRules.js'

export const getPermissionAssignments = async params => {
    const { isAdministrator } = getPermissionAccess()
    if (!params.query?.id) clientError('invalidRequest')
    const user = await dbItem({
        acrossLocales: true,
        id: params.query?.id,
        part: 'accounts',
        type: 'user',
    })
    if (!user || parseId(user.id).tenant !== providers.tenant) clientError('invalidRequest')
    const roles = (await iamGet(`users/${user.uuid}/role-mappings/realm/composite`, params)).map(role => role.name)
    if (!isAdministrator && (user.uuid === providers.user || roles.some(role =>
        rules.protectedRoles.includes(role)
    ))) clientError('invalidRequest')
    const assignments = await dbItems({
        acrossLocales: true,
        part: 'accounts',
        query: { user: user.id },
        type: 'userPermission',
    })
    const permissions = await dbItems({
        acrossLocales: true,
        part: 'accounts',
        query: {},
        type: 'permission',
    })
    const result = {
        assignments,
        permissions,
        roles,
        user,
    }
    return result
}
