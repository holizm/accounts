import {
    dbItem,
    doesTypeBelongToPart,
    parseId,
    translateInternally,
} from 'core'
export default async id => {
    const parsed = parseId(id)
    const item = doesTypeBelongToPart(parsed) ? await dbItem({
        ...parsed,
        acrossLocales: true,
        id
    }) : null
    const result = {
        id,
        title: item?.title || item?.username || item?.name || item?.number || (await translateInternally('notFound'))
    }
    return result
}
