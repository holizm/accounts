import {
    dbItems,
    getApiActionCondition,
    getEnabledParts,
    getTenant,
} from 'core'

export const getPermissionCatalog = async params => {
    const tenant = getTenant(params.host)
    const enabledParts = new Set(await getEnabledParts())
    const catalog = await dbItems({
        acrossLocales: true,
        acrossTenants: true,
        part: 'parts',
        query: {},
        type: 'apiAction',
    })
    const entries = new Map()
    for (const item of catalog) {
        if (!enabledParts.has(item.targetPart)) continue
        if (item.role && !['admin', 'control', ...tenant.roles].includes(item.role)) continue
        const condition = getApiActionCondition({
            action: item.action,
            part: item.targetPart,
            type: item.targetType,
        })
        if (!condition) continue
        if (!entries.has(condition)) {
            entries.set(condition, {
                apiRoles: new Set(),
                condition,
                property: `permission${Buffer.from(condition).toString('hex')}`,
                targetPart: item.targetPart,
                targetType: item.targetType || item.targetPart,
            })
        }
        entries.get(condition).apiRoles.add(item.role ? `api.${item.role}` : 'api')
    }
    const result = [...entries.values()].sort((first, second) => first.condition.localeCompare(second.condition))
    return result
}
