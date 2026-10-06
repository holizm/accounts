import {
    clientError,
    matchesAbacCondition,
    providers,
    settings,
} from 'core'
import rules from './permissionManagementRules.js'

export const getPermissionAccess = options => {
    const roles = providers.identity?.roles || []
    const isAdministrator = settings.security?.toLowerCase() === 'off' || roles.some(role => rules.administratorRoles.includes(role))
    const canManage = isAdministrator || roles.includes('manager')
    if (!canManage && options?.required !== false) clientError('invalidRequest')
    const delegable = settings.permissionDelegation?.manager
    const canDelegate = entry => {
        if (isAdministrator) return true
        if (rules.protectedParts.includes(entry.targetPart)) return false
        if (rules.protectedRoles.includes(entry.role)) return false
        if (Array.isArray(delegable)) {
            return delegable.some(grant => matchesAbacCondition(grant, entry.condition))
        }
        return true
    }
    const result = {
        canDelegate,
        canManage,
        isAdministrator,
    }
    return result
}
