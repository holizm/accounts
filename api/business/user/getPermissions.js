import { getPermissionAssignments } from './getPermissionAssignments.js'
import { getPermissionCatalog } from './getPermissionCatalog.js'

export const getPermissions = async params => {
    const {
        assignments,
        permissions,
        user,
    } = await getPermissionAssignments(params)
    const byId = new Map(permissions.map(permission => [permission.id, permission.condition]))
    const decisions = new Map(assignments.map(assignment => [byId.get(assignment.permission), assignment.effect || 'allow']))
    const options = [
        {
            id: 'inherit',
            title: 'coreInherit',
        },
        {
            id: 'allow',
            title: 'coreAllow',
        },
        {
            id: 'deny',
            title: 'coreDeny',
        },
    ]
    const groups = new Map()
    const result = { id: user.id }
    for (const entry of await getPermissionCatalog(params)) {
        const title = `${entry.targetPart}.${entry.targetType}`
        if (!groups.has(title)) groups.set(title, {
            rows: [],
            title,
        })
        groups.get(title).rows.push({
            apiRolesLabel: [...entry.apiRoles].sort().join(', '),
            condition: entry.condition,
            options,
            property: entry.property,
        })
        result[entry.property] = decisions.get(entry.condition) || 'inherit'
    }
    result.permissionGroups = [...groups.values()]
    result.hasPermissionGroups = result.permissionGroups.length > 0
    return result
}
