import {
    dbUpsertItems,
    generateId,
    parseTenants,
} from 'core'

export const upsertAll = async () => {
    const names = [...new Set(parseTenants().flatMap(tenant => tenant.roles))].sort()
    const items = []
    for (const name of names) {
        const id = await generateId({
            locale: 'shared',
            meaning: name,
            part: 'accounts',
            tenant: 'shared',
            type: 'role',
        })
        items.push({
            id,
            name,
        })
    }
    await dbUpsertItems({
        items,
        part: 'accounts',
        type: 'role',
    })
    return items
}
