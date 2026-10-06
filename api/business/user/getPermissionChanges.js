import { clientError } from 'core'
import { getPermissionAssignments } from './getPermissionAssignments.js'
import { getPermissionCatalog } from './getPermissionCatalog.js'
import { getPermissionVersion } from './getPermissionVersion.js'

export const getPermissionChanges = async params => {
    const context = await getPermissionAssignments(params)
    const catalog = await getPermissionCatalog(params)
    const submitted = Object.entries(params.body || {}).filter(([property]) => property.startsWith('permission'))
    const byProperty = new Map(catalog.map(entry => [entry.property, entry]))
    if (submitted.some(([property, effect]) => !byProperty.has(property) || !['allow', 'deny', 'inherit'].includes(effect))) {
        clientError('invalidRequest')
    }
    const byId = new Map(context.permissions.map(permission => [permission.id, permission.condition]))
    const decisions = new Map(context.assignments.map(assignment => [byId.get(assignment.permission), assignment.effect || 'allow']))
    const changes = submitted.filter(([property, effect]) => effect !== (decisions.get(byProperty.get(property).condition) || 'inherit'))
        .map(([property, effect]) => {
            const entry = byProperty.get(property)
            const change = {
                condition: entry.condition,
                effect,
                previousEffect: decisions.get(entry.condition) || 'inherit',
                property,
            }
            return change
        })
    const result = {
        ...context,
        changes,
        reviewVersion: getPermissionVersion(context.assignments),
    }
    return result
}
