import {
    clientError,
    dbDeleteItems,
    dbUpsertItems,
    generateId,
} from 'core'
import { getPermissionAssignments } from './getPermissionAssignments.js'
import { getPermissionCatalog } from './getPermissionCatalog.js'

export const setPermissions = async params => {
    const {
        assignments,
        permissions,
        user,
    } = await getPermissionAssignments(params)
    const catalog = await getPermissionCatalog(params)
    const submitted = Object.entries(params.body || {}).filter(([property]) => property.startsWith('permission'))
    const byProperty = new Map(catalog.map(entry => [entry.property, entry]))
    if (submitted.some(([property, effect]) => !byProperty.has(property) || !['allow', 'deny', 'inherit'].includes(effect))) {
        clientError('invalidRequest')
    }
    const byCondition = new Map(permissions.map(permission => [permission.condition, permission]))
    const byPermission = new Map(assignments.map(assignment => [assignment.permission, assignment]))
    for (const [property, effect] of submitted) {
        const { condition } = byProperty.get(property)
        let permission = byCondition.get(condition)
        const existing = byPermission.get(permission?.id)
        if (effect === 'inherit') {
            if (existing) await dbDeleteItems({
                acrossLocales: true,
                part: 'accounts',
                query: {
                    id: existing.id,
                    user: user.id,
                },
                returnItems: false,
                type: 'userPermission',
            })
            continue
        }
        if (!permission) {
            const id = await generateId({
                locale: 'shared',
                part: 'accounts',
                type: 'permission',
            })
            permission = {
                condition,
                id,
            }
            await dbUpsertItems({
                items: [permission],
                part: 'accounts',
                type: 'permission',
            })
            byCondition.set(condition, permission)
        }
        const id = existing?.id || await generateId({
            locale: 'shared',
            part: 'accounts',
            type: 'userPermission',
        })
        const assignment = {
            effect,
            id,
            permission: permission.id,
            user: user.id,
        }
        await dbUpsertItems({
            items: [assignment],
            part: 'accounts',
            type: 'userPermission',
        })
    }
    return user
}
