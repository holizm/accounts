import {
    clientError,
    filterOperator,
    list,
    providers,
} from 'core'
import { getPermissionAccess } from './getPermissionAccess.js'
import { getRoleMembers } from './getRoleMembers.js'
import { getRoles } from './getRoles.js'
import rules from './permissionManagementRules.js'

export const getUserList = async params => {
    const {
        canManage,
        isAdministrator,
    } = getPermissionAccess({ required: false })
    const roles = await getRoles({
        ...params,
        query: {},
    })
    const selected = params.query?.role?.replace(/^equalTo_/, '')
    if (selected) {
        if (!roles.some(role => role.name === selected)) clientError('invalidRequest')
        const members = await getRoleMembers(selected, params)
        params.listParameters.addFilter('uuid', members.map(user => user.id), filterOperator.in)
    }
    const protectedUsers = new Set()
    if (canManage && !isAdministrator) {
        for (const role of roles.filter(role => rules.protectedRoles.includes(role.name))) {
            for (const user of await getRoleMembers(role.name, params)) protectedUsers.add(user.id)
        }
    }
    const result = await list(params)
    for (const user of result.data) {
        user.canManagePermissions = canManage && (isAdministrator ||
            user.uuid !== providers.user && !protectedUsers.has(user.uuid))
    }
    return result
}
