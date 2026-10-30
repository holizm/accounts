import { availableParallelism } from 'os'
import {
    getCollection,
    serverError,
} from 'core'
import { iamGet } from '../iam.js'
import { createTenantIamOptions } from '../tenantIamOptions.js'

export const getTenantRoleUsers = async ({
    offset = 0,
    target,
}) => {
    const options = createTenantIamOptions(target.tenantConfiguration)
    const collection = await getCollection('accounts', 'user')
    const records = await collection.find({
        tenant: target.tenant,
    }).sort({
        creationDate: 1,
        id: 1,
    }).skip(offset).limit(100).toArray()
    const users = []
    let next = 0
    const work = async () => {
        while (next < records.length) {
            const record = records[next++]
            if (!record.uuid) continue
            const path = `users/${encodeURIComponent(record.uuid)}`
            const member = await iamGet(path, options)
            if (!member?.enabled || member.id !== record.uuid) continue
            const roles = await iamGet(`${path}/role-mappings/realm/composite`, options)
            if (!Array.isArray(roles)) serverError('coreApiRoleAccessFailed')
            if (!roles.some(role => role.name === target.role)) continue
            users.push({
                name: [member.firstName, member.lastName].filter(Boolean).join(' ') || member.username,
                uuid: member.id,
            })
        }
    }
    await Promise.all(Array.from({ length: Math.min(availableParallelism(), records.length) }, work))
    const result = {
        hasMore: records.length === 100,
        nextOffset: offset + 100,
        users,
    }
    return result
}
