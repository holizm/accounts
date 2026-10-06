import { getPermissionChanges } from './getPermissionChanges.js'

export const previewPermissions = async params => {
    const {
        changes,
        reviewVersion,
    } = await getPermissionChanges(params)
    const rows = changes.map(change => {
        const row = {
            condition: change.condition,
            from: `core${change.previousEffect.charAt(0).toUpperCase()}${change.previousEffect.slice(1)}`,
            to: `core${change.effect.charAt(0).toUpperCase()}${change.effect.slice(1)}`,
        }
        return row
    })
    const result = {
        hasChanges: rows.length > 0,
        reviewVersion,
        rows,
    }
    return result
}
