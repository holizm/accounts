import { getEffectivePermission } from './getEffectivePermission.js'
import { getPermissionAssignments } from './getPermissionAssignments.js'
import { getPermissionCatalog } from './getPermissionCatalog.js'

export const getPermissions = async params => {
    const {
        assignments,
        permissions,
        roles,
        user,
    } = await getPermissionAssignments(params)
    const byId = new Map(permissions.map(permission => [permission.id, permission.condition]))
    const decisions = new Map(assignments.map(assignment => [byId.get(assignment.permission), assignment.effect || 'allow']))
    const rules = assignments.filter(assignment => byId.has(assignment.permission)).map(assignment => {
        const rule = {
            condition: byId.get(assignment.permission),
            effect: assignment.effect || 'allow',
        }
        return rule
    })
    const search = (params.query?.search || '').toLowerCase()
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
            ...getEffectivePermission({
                condition: entry.condition,
                roles,
                rules,
            }),
            apiRolesLabel: [...entry.apiRoles].sort().join(', '),
            condition: entry.condition,
            hidden: !entry.condition.toLowerCase().includes(search),
            options,
            property: entry.property,
        })
        result[entry.property] = decisions.get(entry.condition) || 'inherit'
    }
    result.permissionGroups = [...groups.values()].map(group => {
        group.hidden = group.rows.every(row => row.hidden)
        return group
    })
    result.hasPermissionGroups = result.permissionGroups.some(group => !group.hidden)
    return result
}
