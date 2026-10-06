import {
    clientError,
    dbDeleteItems,
    dbUpsertItems,
    generateId,
} from 'core'
import { getPermissionChanges } from './getPermissionChanges.js'

export const setPermissions = async params => {
    const {
        assignments,
        changes,
        permissions,
        reviewVersion,
        user,
    } = await getPermissionChanges(params)
    if (params.body?.reviewVersion !== reviewVersion) clientError('invalidRequest')
    const byCondition = new Map(permissions.map(permission => [permission.condition, permission]))
    const byPermission = new Map(assignments.map(assignment => [assignment.permission, assignment]))
    for (const {
        condition,
        effect,
    } of changes) {
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
