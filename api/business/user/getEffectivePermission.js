import {
    getRolePermissions,
    matchesAbacCondition,
    resolveAbacPermission,
    settings,
} from 'core'

export const getEffectivePermission = ({
    condition,
    roles,
    rules,
}) => {
    const grants = settings.abacEnabled === true
        ?
        getRolePermissions(roles)
        :
        ['*.*.*']
    const allowed = resolveAbacPermission({
        condition,
        grants,
        rules,
    })
    const matching = rules.filter(rule => matchesAbacCondition(rule.condition, condition))
    const overridden = matching.some(rule => rule.effect === 'deny') || matching.some(rule => rule.effect === 'allow')
    const result = {
        effective: allowed
            ?
            'coreAllow'
            :
            'coreDeny',
        source: overridden
            ?
            'accountsUserPermissions'
            :
            'coreRoles',
    }
    return result
}
