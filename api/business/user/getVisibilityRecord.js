import {
    clientError,
    dbItem,
    doesTypeBelongToPart,
    parseId,
    providers,
} from 'core'
import assertVisibilityAdministrator from './assertVisibilityAdministrator.js'
export default async id => {
    assertVisibilityAdministrator()
    if (typeof id !== 'string') clientError('invalidRequest')
    const parsed = parseId(id)
    if (parsed.tenant !== providers.tenant || !doesTypeBelongToPart(parsed)) clientError('forbidden')
    const item = await dbItem({
        ...parsed,
        acrossLocales: true,
        id
    })
    if (!item) clientError('notFound')
    return item
}
