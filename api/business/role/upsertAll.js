import {
    dbUpsertItems,
    generateId,
    getSystemRoles,
} from 'core'

export const upsertAll = async () => {
    const names = getSystemRoles()
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
