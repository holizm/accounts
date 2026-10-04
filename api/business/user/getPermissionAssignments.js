import {
    clientError,
    dbItem,
    dbItems,
    parseId,
    providers,
} from 'core'

export const getPermissionAssignments = async params => {
    if (!params.query?.id) clientError('invalidRequest')
    const user = await dbItem({
        acrossLocales: true,
        id: params.query?.id,
        part: 'accounts',
        type: 'user',
    })
    if (!user || parseId(user.id).tenant !== providers.tenant) clientError('invalidRequest')
    const assignments = await dbItems({
        acrossLocales: true,
        part: 'accounts',
        query: { user: user.id },
        type: 'userPermission',
    })
    const permissions = await dbItems({
        acrossLocales: true,
        part: 'accounts',
        query: {},
        type: 'permission',
    })
    const result = {
        assignments,
        permissions,
        user,
    }
    return result
}
