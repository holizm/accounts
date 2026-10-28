import {
    callIfExists,
    clientError,
    dbFindOneAndUpdate,
    getPaths,
    parseId,
    postWrite,
} from 'core'
import getVisibilityRecord from '../user/getVisibilityRecord.js'
import getVisibilityVersion from '../user/getVisibilityVersion.js'
export const setRecordVisibility = async params => {
    const item = await getVisibilityRecord(params.body?.record)
    if (params.body?.reviewVersion !== getVisibilityVersion(item.visibleTo)) clientError('invalidRequest')
    const parsed = parseId(item.id)
    const changes = { visibleTo: params.body?.visibleTo }
    await callIfExists(getPaths(parsed).preUpsertion, {
        ...parsed,
        id: item.id,
        item: changes,
    })
    const visibility = Object.hasOwn(item, 'visibleTo') ? { $eq: item.visibleTo } : { $exists: false }
    const updated = await dbFindOneAndUpdate({
        ...parsed,
        options: { returnDocument: 'after' },
        query: {
            id: item.id,
            visibleTo: visibility
        },
        updateQuery: { $set: changes }
    })
    if (!updated) clientError('invalidRequest')
    await postWrite({
        ...parsed,
        action: 'update',
        item: updated
    })
    const result = {
        record: updated.id,
        visibleTo: updated.visibleTo
    }
    return result
}
