import getVisibilityRecord from '../user/getVisibilityRecord.js'
import getVisibilityTarget from '../user/getVisibilityTarget.js'
import getVisibilityVersion from '../user/getVisibilityVersion.js'
export const getRecordVisibility = async params => {
    const item = await getVisibilityRecord(params.query?.record)
    const scopes = []
    const visibleTo = Array.isArray(item.visibleTo) ? item.visibleTo : []
    for (const id of visibleTo) {
        scopes.push(await getVisibilityTarget(id))
    }
    const result = {
        record: item.id,
        reviewVersion: getVisibilityVersion(item.visibleTo),
        scopes,
        visibleTo
    }
    return result
}
