import {
    dbItems,
    getApiActionCondition,
    getEnabledParts,
    getTenant,
} from 'core'
import { getPermissionAccess } from './getPermissionAccess.js'

export const getPermissionCatalog = async params => {
    const { canDelegate } = getPermissionAccess()
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
        for (const method of item.methods || ['GET']) {
            const condition = getApiActionCondition({
                action: item.action,
                method,
                part: item.targetPart,
                type: item.targetType,
            })
            if (!condition || !canDelegate({
                ...item,
                condition,
            })) continue
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
    }
    const result = [...entries.values()].sort((first, second) => first.condition.localeCompare(second.condition))
    return result
}
