import {
    clientError,
    dbItem,
    parseId,
    providers,
} from 'core'
export default async item => {
    const user = typeof item.user === 'string' ? parseId(item.user) : null
    if (user?.tenant !== providers.tenant || user?.part !== 'accounts' || user?.type !== 'user') clientError('invalidRequest')
    const existingUser = await dbItem({
        acrossLocales: true,
        id: item.user,
        part: 'accounts',
        type: 'user'
    })
    if (!existingUser) clientError('invalidRequest')
    if (item.tenantWide === true) {
        if (item.item) clientError('invalidRequest')
        return
    }
    if (item.tenantWide !== undefined && item.tenantWide !== false) clientError('invalidRequest')
    if (typeof item.item !== 'string') clientError('invalidRequest')
    const reference = parseId(item.item)
    if (![providers.tenant, ...providers.tenantGroups, 'shared'].includes(reference.tenant)) clientError('invalidRequest')
    const target = await dbItem({
        acrossLocales: true,
        id: item.item,
        part: reference.part,
        type: reference.type
    })
    if (!target) clientError('invalidRequest')
}
